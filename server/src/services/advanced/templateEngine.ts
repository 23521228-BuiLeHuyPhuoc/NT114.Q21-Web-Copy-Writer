/**
 * Advanced Feature: Template Engine with Variable Interpolation
 * 
 * Implements a custom template DSL (Domain-Specific Language) parser that:
 * 
 * 1. Parses template syntax with {{variable}} placeholders
 * 2. Supports conditional blocks: {{#if condition}}...{{/if}}
 * 3. Supports loops: {{#each items}}...{{/each}}
 * 4. Supports filters/pipes: {{variable | uppercase}}
 * 5. Validates template syntax and reports errors
 * 6. Compiles templates for efficient repeated use
 * 
 * This is a mini programming language implementation demonstrating
 * compiler/interpreter concepts (lexing, parsing, evaluation).
 */

interface TemplateToken {
  type: 'text' | 'variable' | 'if_start' | 'if_end' | 'each_start' | 'each_end' | 'else';
  value: string;
  filter?: string;
  position: number;
}

interface TemplateNode {
  type: 'text' | 'variable' | 'conditional' | 'loop';
  value?: string;
  filter?: string;
  condition?: string;
  iterVar?: string;
  itemVar?: string;
  children?: TemplateNode[];
  elseChildren?: TemplateNode[];
}

interface TemplateError {
  message: string;
  position: number;
  line: number;
  column: number;
}

interface CompiledTemplate {
  ast: TemplateNode[];
  variables: string[];
  errors: TemplateError[];
  isValid: boolean;
}

// Available filters
const FILTERS: Record<string, (value: string) => string> = {
  uppercase: (v: string) => v.toUpperCase(),
  lowercase: (v: string) => v.toLowerCase(),
  capitalize: (v: string) => v.charAt(0).toUpperCase() + v.slice(1),
  trim: (v: string) => v.trim(),
  truncate: (v: string) => v.length > 100 ? v.substring(0, 100) + '...' : v,
  slug: (v: string) => v.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
  reverse: (v: string) => v.split('').reverse().join(''),
  wordcount: (v: string) => String(v.split(/\s+/).filter(w => w.length > 0).length),
  sentencecase: (v: string) => {
    return v.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
  },
  striphtml: (v: string) => v.replace(/<[^>]*>/g, ''),
};

/**
 * Lexer: Tokenize the template string
 */
function tokenize(template: string): TemplateToken[] {
  const tokens: TemplateToken[] = [];
  let i = 0;
  let textStart = 0;

  while (i < template.length) {
    if (template[i] === '{' && template[i + 1] === '{') {
      // Save any text before this token
      if (i > textStart) {
        tokens.push({
          type: 'text',
          value: template.substring(textStart, i),
          position: textStart,
        });
      }

      // Find closing }}
      const closeIndex = template.indexOf('}}', i + 2);
      if (closeIndex === -1) {
        // Unclosed template expression, treat as text
        tokens.push({
          type: 'text',
          value: template.substring(i),
          position: i,
        });
        break;
      }

      const content = template.substring(i + 2, closeIndex).trim();

      // Determine token type
      if (content.startsWith('#if ')) {
        tokens.push({
          type: 'if_start',
          value: content.substring(4).trim(),
          position: i,
        });
      } else if (content === '/if') {
        tokens.push({
          type: 'if_end',
          value: '',
          position: i,
        });
      } else if (content === 'else') {
        tokens.push({
          type: 'else',
          value: '',
          position: i,
        });
      } else if (content.startsWith('#each ')) {
        tokens.push({
          type: 'each_start',
          value: content.substring(6).trim(),
          position: i,
        });
      } else if (content === '/each') {
        tokens.push({
          type: 'each_end',
          value: '',
          position: i,
        });
      } else {
        // Variable, possibly with filter
        const parts = content.split('|').map(p => p.trim());
        tokens.push({
          type: 'variable',
          value: parts[0],
          filter: parts[1] || undefined,
          position: i,
        });
      }

      i = closeIndex + 2;
      textStart = i;
    } else {
      i++;
    }
  }

  // Remaining text
  if (textStart < template.length) {
    tokens.push({
      type: 'text',
      value: template.substring(textStart),
      position: textStart,
    });
  }

  return tokens;
}

/**
 * Parser: Build AST from tokens
 */
function parse(tokens: TemplateToken[]): { ast: TemplateNode[]; errors: TemplateError[] } {
  const errors: TemplateError[] = [];
  let index = 0;

  function getLineAndColumn(position: number): { line: number; column: number } {
    // Simplified - in a real implementation, we'd track this from the source
    return { line: 1, column: position };
  }

  function parseNodes(stopAt?: 'if_end' | 'each_end' | 'else'): TemplateNode[] {
    const nodes: TemplateNode[] = [];

    while (index < tokens.length) {
      const token = tokens[index];

      if (stopAt && (token.type === stopAt || token.type === 'else')) {
        break;
      }

      switch (token.type) {
        case 'text':
          nodes.push({ type: 'text', value: token.value });
          index++;
          break;

        case 'variable':
          nodes.push({
            type: 'variable',
            value: token.value,
            filter: token.filter,
          });
          index++;
          break;

        case 'if_start': {
          index++;
          const children = parseNodes('if_end');
          let elseChildren: TemplateNode[] | undefined;

          if (index < tokens.length && tokens[index].type === 'else') {
            index++; // skip else
            elseChildren = parseNodes('if_end');
          }

          if (index < tokens.length && tokens[index].type === 'if_end') {
            index++; // skip /if
          } else {
            const { line, column } = getLineAndColumn(token.position);
            errors.push({
              message: `Unclosed {{#if}} block starting at position ${token.position}`,
              position: token.position,
              line,
              column,
            });
          }

          nodes.push({
            type: 'conditional',
            condition: token.value,
            children,
            elseChildren,
          });
          break;
        }

        case 'each_start': {
          const parts = token.value.split(' as ');
          const iterVar = parts[0].trim();
          const itemVar = parts[1]?.trim() || 'item';
          
          index++;
          const children = parseNodes('each_end');

          if (index < tokens.length && tokens[index].type === 'each_end') {
            index++; // skip /each
          } else {
            const { line, column } = getLineAndColumn(token.position);
            errors.push({
              message: `Unclosed {{#each}} block starting at position ${token.position}`,
              position: token.position,
              line,
              column,
            });
          }

          nodes.push({
            type: 'loop',
            iterVar,
            itemVar,
            children,
          });
          break;
        }

        case 'if_end':
        case 'each_end':
        case 'else': {
          if (!stopAt) {
            const { line, column } = getLineAndColumn(token.position);
            errors.push({
              message: `Unexpected {{${token.type === 'if_end' ? '/if' : token.type === 'each_end' ? '/each' : 'else'}}} at position ${token.position}`,
              position: token.position,
              line,
              column,
            });
          }
          return nodes;
        }

        default:
          index++;
      }
    }

    return nodes;
  }

  const ast = parseNodes();
  return { ast, errors };
}

/**
 * Evaluator: Execute the AST with given variables
 */
function evaluate(nodes: TemplateNode[], variables: Record<string, unknown>): string {
  let output = '';

  for (const node of nodes) {
    switch (node.type) {
      case 'text':
        output += node.value || '';
        break;

      case 'variable': {
        // Support nested property access (e.g., "user.name")
        let value = resolveVariable(node.value || '', variables);
        let strValue = value !== undefined && value !== null ? String(value) : '';

        // Apply filter if specified
        if (node.filter && FILTERS[node.filter]) {
          strValue = FILTERS[node.filter](strValue);
        }

        output += strValue;
        break;
      }

      case 'conditional': {
        const conditionValue = resolveVariable(node.condition || '', variables);
        const isTruthy = Boolean(conditionValue) && conditionValue !== '' && conditionValue !== '0';

        if (isTruthy && node.children) {
          output += evaluate(node.children, variables);
        } else if (!isTruthy && node.elseChildren) {
          output += evaluate(node.elseChildren, variables);
        }
        break;
      }

      case 'loop': {
        const iterValue = resolveVariable(node.iterVar || '', variables);
        if (Array.isArray(iterValue) && node.children) {
          for (let i = 0; i < iterValue.length; i++) {
            const loopVars = {
              ...variables,
              [node.itemVar || 'item']: iterValue[i],
              '@index': i,
              '@first': i === 0,
              '@last': i === iterValue.length - 1,
            };
            output += evaluate(node.children, loopVars);
          }
        }
        break;
      }
    }
  }

  return output;
}

/**
 * Resolve a variable path (supports dot notation)
 */
function resolveVariable(path: string, variables: Record<string, unknown>): unknown {
  const parts = path.split('.');
  let current: unknown = variables;

  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    if (typeof current === 'object') {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  return current;
}

/**
 * Extract all variable names used in a template
 */
function extractVariables(nodes: TemplateNode[]): string[] {
  const vars = new Set<string>();

  function walk(nodeList: TemplateNode[]) {
    for (const node of nodeList) {
      if (node.type === 'variable' && node.value) {
        vars.add(node.value);
      }
      if (node.type === 'conditional' && node.condition) {
        vars.add(node.condition);
      }
      if (node.type === 'loop' && node.iterVar) {
        vars.add(node.iterVar);
      }
      if (node.children) walk(node.children);
      if (node.elseChildren) walk(node.elseChildren);
    }
  }

  walk(nodes);
  return Array.from(vars);
}

/**
 * Compile a template string into a reusable compiled template
 */
export function compileTemplate(templateStr: string): CompiledTemplate {
  const tokens = tokenize(templateStr);
  const { ast, errors } = parse(tokens);
  const variables = extractVariables(ast);

  return {
    ast,
    variables,
    errors,
    isValid: errors.length === 0,
  };
}

/**
 * Render a compiled template with variables
 */
export function renderTemplate(compiled: CompiledTemplate, variables: Record<string, unknown>): string {
  if (!compiled.isValid) {
    throw new Error(`Template has errors: ${compiled.errors.map(e => e.message).join(', ')}`);
  }
  return evaluate(compiled.ast, variables);
}

/**
 * Convenience function: compile and render in one step
 */
export function processTemplate(templateStr: string, variables: Record<string, unknown>): {
  output: string;
  usedVariables: string[];
  errors: TemplateError[];
} {
  const compiled = compileTemplate(templateStr);
  
  if (!compiled.isValid) {
    return {
      output: '',
      usedVariables: compiled.variables,
      errors: compiled.errors,
    };
  }

  const output = evaluate(compiled.ast, variables);
  return {
    output,
    usedVariables: compiled.variables,
    errors: [],
  };
}

/**
 * Validate a template string without rendering
 */
export function validateTemplate(templateStr: string): {
  isValid: boolean;
  variables: string[];
  errors: TemplateError[];
  availableFilters: string[];
} {
  const compiled = compileTemplate(templateStr);
  return {
    isValid: compiled.isValid,
    variables: compiled.variables,
    errors: compiled.errors,
    availableFilters: Object.keys(FILTERS),
  };
}

/**
 * Get list of available filters
 */
export function getAvailableFilters(): { name: string; description: string }[] {
  return [
    { name: 'uppercase', description: 'Convert text to uppercase' },
    { name: 'lowercase', description: 'Convert text to lowercase' },
    { name: 'capitalize', description: 'Capitalize first letter' },
    { name: 'trim', description: 'Remove leading/trailing whitespace' },
    { name: 'truncate', description: 'Truncate to 100 characters' },
    { name: 'slug', description: 'Convert to URL-friendly slug' },
    { name: 'reverse', description: 'Reverse the text' },
    { name: 'wordcount', description: 'Count words in text' },
    { name: 'sentencecase', description: 'Convert to sentence case' },
    { name: 'striphtml', description: 'Remove HTML tags' },
  ];
}
