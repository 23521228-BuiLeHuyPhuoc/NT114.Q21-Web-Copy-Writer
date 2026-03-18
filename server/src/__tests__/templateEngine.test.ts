import {
  processTemplate,
  validateTemplate,
  compileTemplate,
  renderTemplate,
  getAvailableFilters,
} from '../services/advanced/templateEngine';

describe('Template Engine with DSL Parser', () => {
  describe('Variable Interpolation', () => {
    it('should replace simple variables', () => {
      const result = processTemplate('Hello {{name}}!', { name: 'World' });
      expect(result.output).toBe('Hello World!');
    });

    it('should support dot notation for nested objects', () => {
      const result = processTemplate('Hello {{user.name}}!', {
        user: { name: 'Alice' },
      });
      expect(result.output).toBe('Hello Alice!');
    });

    it('should handle missing variables gracefully', () => {
      const result = processTemplate('Hello {{name}}!', {});
      expect(result.output).toBe('Hello !');
    });

    it('should replace multiple variables', () => {
      const result = processTemplate('{{greeting}}, {{name}}! Welcome to {{place}}.', {
        greeting: 'Hello',
        name: 'Bob',
        place: 'the world',
      });
      expect(result.output).toBe('Hello, Bob! Welcome to the world.');
    });
  });

  describe('Filter/Pipe Support', () => {
    it('should apply uppercase filter', () => {
      const result = processTemplate('{{name | uppercase}}', { name: 'hello' });
      expect(result.output).toBe('HELLO');
    });

    it('should apply lowercase filter', () => {
      const result = processTemplate('{{name | lowercase}}', { name: 'HELLO' });
      expect(result.output).toBe('hello');
    });

    it('should apply capitalize filter', () => {
      const result = processTemplate('{{name | capitalize}}', { name: 'hello world' });
      expect(result.output).toBe('Hello world');
    });

    it('should apply slug filter', () => {
      const result = processTemplate('{{title | slug}}', { title: 'Hello World Test' });
      expect(result.output).toBe('hello-world-test');
    });

    it('should apply wordcount filter', () => {
      const result = processTemplate('Word count: {{text | wordcount}}', { text: 'one two three' });
      expect(result.output).toBe('Word count: 3');
    });
  });

  describe('Conditional Blocks', () => {
    it('should render content when condition is truthy', () => {
      const result = processTemplate('{{#if show}}Visible{{/if}}', { show: true });
      expect(result.output).toBe('Visible');
    });

    it('should hide content when condition is falsy', () => {
      const result = processTemplate('{{#if show}}Visible{{/if}}', { show: false });
      expect(result.output).toBe('');
    });

    it('should support else blocks', () => {
      const result = processTemplate('{{#if premium}}Pro{{else}}Free{{/if}}', { premium: false });
      expect(result.output).toBe('Free');
    });

    it('should handle nested variables in conditions', () => {
      const result = processTemplate(
        '{{#if user.premium}}Welcome Pro!{{else}}Upgrade now{{/if}}',
        { user: { premium: true } }
      );
      expect(result.output).toBe('Welcome Pro!');
    });
  });

  describe('Loop Blocks', () => {
    it('should iterate over arrays', () => {
      const result = processTemplate(
        '{{#each items as item}}{{item}} {{/each}}',
        { items: ['a', 'b', 'c'] }
      );
      expect(result.output).toBe('a b c ');
    });

    it('should support @index in loops', () => {
      const result = processTemplate(
        '{{#each items as item}}{{@index}}:{{item}} {{/each}}',
        { items: ['x', 'y', 'z'] }
      );
      expect(result.output).toBe('0:x 1:y 2:z ');
    });

    it('should handle empty arrays', () => {
      const result = processTemplate(
        '{{#each items as item}}{{item}}{{/each}}',
        { items: [] }
      );
      expect(result.output).toBe('');
    });
  });

  describe('Template Validation', () => {
    it('should validate correct templates', () => {
      const result = validateTemplate('Hello {{name}}!');
      expect(result.isValid).toBe(true);
      expect(result.variables).toContain('name');
    });

    it('should detect unclosed if blocks', () => {
      const result = validateTemplate('{{#if show}}Content');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should detect unclosed each blocks', () => {
      const result = validateTemplate('{{#each items as item}}Content');
      expect(result.isValid).toBe(false);
    });

    it('should list available filters', () => {
      const result = validateTemplate('{{x}}');
      expect(result.availableFilters.length).toBeGreaterThan(0);
    });
  });

  describe('Compiled Templates', () => {
    it('should compile and render efficiently', () => {
      const compiled = compileTemplate('Hello {{name | uppercase}}!');
      expect(compiled.isValid).toBe(true);

      const output1 = renderTemplate(compiled, { name: 'alice' });
      expect(output1).toBe('Hello ALICE!');

      const output2 = renderTemplate(compiled, { name: 'bob' });
      expect(output2).toBe('Hello BOB!');
    });
  });

  describe('Available Filters', () => {
    it('should list all available filters', () => {
      const filters = getAvailableFilters();
      expect(filters.length).toBeGreaterThan(0);
      expect(filters[0].name).toBeDefined();
      expect(filters[0].description).toBeDefined();
    });
  });

  describe('Complex Templates', () => {
    it('should handle complex real-world template', () => {
      const template = [
        'Dear {{recipient.name | capitalize}},',
        '',
        '{{#if recipient.premium}}Thank you for being a valued premium member!{{else}}Consider upgrading to premium!{{/if}}',
        '',
        'Here are your items:',
        '{{#each items as item}}',
        '- {{item.name}}: {{item.price}}',
        '{{/each}}',
        '',
        'Best regards,',
        '{{sender | uppercase}}',
      ].join('\n');

      const result = processTemplate(template, {
        recipient: { name: 'john', premium: true },
        items: [
          { name: 'Widget', price: '$9.99' },
          { name: 'Gadget', price: '$19.99' },
        ],
        sender: 'AI Copywriter',
      });

      expect(result.output).toContain('John');
      expect(result.output).toContain('valued premium member');
      expect(result.output).toContain('Widget');
      expect(result.output).toContain('AI COPYWRITER');
    });
  });
});
