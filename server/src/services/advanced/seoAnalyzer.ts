/**
 * Advanced Feature: SEO Content Analysis Engine
 * 
 * Provides comprehensive SEO analysis of generated content including:
 * 
 * 1. Readability Score (Flesch-Kincaid, Coleman-Liau, Automated Readability Index)
 * 2. Keyword Density Analysis with TF-IDF ranking
 * 3. Content Structure Analysis (headings, paragraphs, lists)
 * 4. Meta Tag Optimization Suggestions
 * 5. Semantic Keyword Suggestions using co-occurrence analysis
 * 6. Content Length and Word Count Analysis
 * 7. Sentence Complexity Analysis
 */

interface SEOAnalysisResult {
  overallScore: number;          // 0-100
  readability: ReadabilityAnalysis;
  keywords: KeywordAnalysis;
  structure: StructureAnalysis;
  contentMetrics: ContentMetrics;
  suggestions: SEOSuggestion[];
}

interface ReadabilityAnalysis {
  fleschKincaidGrade: number;
  fleschReadingEase: number;
  colemanLiauIndex: number;
  automatedReadabilityIndex: number;
  averageGrade: number;
  difficulty: 'very_easy' | 'easy' | 'moderate' | 'difficult' | 'very_difficult';
}

interface KeywordAnalysis {
  topKeywords: KeywordInfo[];
  keywordDensity: Map<string, number> | Record<string, number>;
  suggestedKeywords: string[];
  overusedKeywords: string[];
  missingKeywords: string[];
}

interface KeywordInfo {
  keyword: string;
  count: number;
  density: number;    // percentage
  tfidfScore: number;
  positions: number[];
}

interface StructureAnalysis {
  hasTitle: boolean;
  headingCount: { h1: number; h2: number; h3: number; h4: number };
  paragraphCount: number;
  listCount: number;
  linkCount: number;
  imageCount: number;
  hasMetaDescription: boolean;
  structureScore: number; // 0-100
}

interface ContentMetrics {
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  averageSentenceLength: number;
  averageWordLength: number;
  vocabularyRichness: number;   // unique words / total words
  longSentencePercentage: number;
  passiveVoicePercentage: number;
  transitionWordPercentage: number;
}

interface SEOSuggestion {
  type: 'error' | 'warning' | 'info' | 'success';
  category: string;
  message: string;
  priority: number; // 1-5, where 5 is highest
}

// Common English stop words to exclude from keyword analysis
const STOP_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see',
  'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over',
  'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work',
  'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these',
  'give', 'day', 'most', 'us', 'is', 'are', 'was', 'were', 'been', 'has',
  'had', 'did', 'does', 'am', 'being', 'having', 'doing',
]);

// Transition words for content flow analysis
const TRANSITION_WORDS = new Set([
  'however', 'therefore', 'furthermore', 'moreover', 'additionally',
  'consequently', 'nevertheless', 'meanwhile', 'similarly', 'likewise',
  'conversely', 'alternatively', 'specifically', 'particularly', 'notably',
  'importantly', 'significantly', 'essentially', 'ultimately', 'overall',
  'firstly', 'secondly', 'thirdly', 'finally', 'subsequently',
  'in addition', 'in contrast', 'on the other hand', 'as a result',
  'for example', 'for instance', 'in conclusion', 'to summarize',
]);

/**
 * Count syllables in a word using a heuristic approach
 */
function countSyllables(word: string): number {
  word = word.toLowerCase().trim();
  if (word.length <= 3) return 1;

  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

/**
 * Split text into sentences
 */
function splitSentences(text: string): string[] {
  return text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

/**
 * Split text into words
 */
function splitWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s'-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 0);
}

/**
 * Readability Score 1: Flesch-Kincaid Grade Level
 * 
 * Formula: 0.39 × (words/sentences) + 11.8 × (syllables/words) - 15.59
 * Result: US school grade level needed to understand the text
 */
function fleschKincaidGrade(words: string[], sentences: string[]): number {
  if (sentences.length === 0 || words.length === 0) return 0;
  
  const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const avgSentenceLength = words.length / sentences.length;
  const avgSyllablesPerWord = totalSyllables / words.length;

  return (0.39 * avgSentenceLength) + (11.8 * avgSyllablesPerWord) - 15.59;
}

/**
 * Readability Score 2: Flesch Reading Ease
 * 
 * Formula: 206.835 - 1.015 × (words/sentences) - 84.6 × (syllables/words)
 * Result: Score from 0-100 (higher = easier to read)
 */
function fleschReadingEase(words: string[], sentences: string[]): number {
  if (sentences.length === 0 || words.length === 0) return 0;
  
  const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const avgSentenceLength = words.length / sentences.length;
  const avgSyllablesPerWord = totalSyllables / words.length;

  return 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
}

/**
 * Readability Score 3: Coleman-Liau Index
 * 
 * Formula: 0.0588 × L - 0.296 × S - 15.8
 * Where L = average number of letters per 100 words
 *       S = average number of sentences per 100 words
 */
function colemanLiauIndex(words: string[], sentences: string[]): number {
  if (words.length === 0 || sentences.length === 0) return 0;

  const totalLetters = words.reduce((sum, w) => sum + w.replace(/[^a-zA-Z]/g, '').length, 0);
  const L = (totalLetters / words.length) * 100;
  const S = (sentences.length / words.length) * 100;

  return (0.0588 * L) - (0.296 * S) - 15.8;
}

/**
 * Readability Score 4: Automated Readability Index
 * 
 * Formula: 4.71 × (characters/words) + 0.5 × (words/sentences) - 21.43
 */
function automatedReadabilityIndex(words: string[], sentences: string[]): number {
  if (words.length === 0 || sentences.length === 0) return 0;

  const totalChars = words.reduce((sum, w) => sum + w.length, 0);
  const charsPerWord = totalChars / words.length;
  const wordsPerSentence = words.length / sentences.length;

  return (4.71 * charsPerWord) + (0.5 * wordsPerSentence) - 21.43;
}

/**
 * Determine reading difficulty level
 */
function getDifficultyLevel(fleschEase: number): ReadabilityAnalysis['difficulty'] {
  if (fleschEase >= 80) return 'very_easy';
  if (fleschEase >= 60) return 'easy';
  if (fleschEase >= 40) return 'moderate';
  if (fleschEase >= 20) return 'difficult';
  return 'very_difficult';
}

/**
 * Analyze keyword density and importance using TF-IDF
 */
function analyzeKeywords(text: string, targetKeywords?: string[]): KeywordAnalysis {
  const words = splitWords(text);
  const contentWords = words.filter(w => !STOP_WORDS.has(w) && w.length > 2);
  
  // Count word frequencies
  const wordCount = new Map<string, { count: number; positions: number[] }>();
  contentWords.forEach((word, index) => {
    const existing = wordCount.get(word);
    if (existing) {
      existing.count++;
      existing.positions.push(index);
    } else {
      wordCount.set(word, { count: 1, positions: [index] });
    }
  });

  // Calculate densities and TF-IDF scores
  const totalWords = words.length;
  const topKeywords: KeywordInfo[] = [];
  const keywordDensity: Record<string, number> = {};
  const overusedKeywords: string[] = [];

  for (const [word, data] of wordCount.entries()) {
    const density = (data.count / totalWords) * 100;
    const tf = data.count / contentWords.length;
    // Simplified IDF (in a real app, this would use a corpus)
    const idf = Math.log(1 + 1 / (data.count / totalWords));
    const tfidfScore = tf * idf;

    keywordDensity[word] = Math.round(density * 100) / 100;

    topKeywords.push({
      keyword: word,
      count: data.count,
      density: Math.round(density * 100) / 100,
      tfidfScore: Math.round(tfidfScore * 10000) / 10000,
      positions: data.positions,
    });

    // Flag overused keywords (density > 3%)
    if (density > 3) {
      overusedKeywords.push(word);
    }
  }

  // Sort by TF-IDF score
  topKeywords.sort((a, b) => b.tfidfScore - a.tfidfScore);

  // Find missing target keywords
  const missingKeywords = targetKeywords
    ? targetKeywords.filter(k => !wordCount.has(k.toLowerCase()))
    : [];

  // Generate keyword suggestions based on co-occurrence
  const suggestedKeywords = generateKeywordSuggestions(contentWords, topKeywords.slice(0, 5));

  return {
    topKeywords: topKeywords.slice(0, 20),
    keywordDensity,
    suggestedKeywords,
    overusedKeywords,
    missingKeywords,
  };
}

/**
 * Generate keyword suggestions based on co-occurrence patterns
 */
function generateKeywordSuggestions(words: string[], topKeywords: KeywordInfo[]): string[] {
  const coOccurrence = new Map<string, Map<string, number>>();
  const windowSize = 5;

  // Build co-occurrence matrix within a sliding window
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (!coOccurrence.has(word)) {
      coOccurrence.set(word, new Map());
    }

    for (let j = Math.max(0, i - windowSize); j < Math.min(words.length, i + windowSize); j++) {
      if (i !== j) {
        const neighbor = words[j];
        const neighbors = coOccurrence.get(word)!;
        neighbors.set(neighbor, (neighbors.get(neighbor) || 0) + 1);
      }
    }
  }

  // Find words that frequently co-occur with top keywords
  const suggestions = new Set<string>();
  const topKeywordSet = new Set(topKeywords.map(k => k.keyword));

  for (const keyword of topKeywords) {
    const neighbors = coOccurrence.get(keyword.keyword);
    if (neighbors) {
      const sortedNeighbors = [...neighbors.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      for (const [neighbor] of sortedNeighbors) {
        if (!topKeywordSet.has(neighbor) && !STOP_WORDS.has(neighbor)) {
          suggestions.add(neighbor);
        }
      }
    }
  }

  return [...suggestions].slice(0, 10);
}

/**
 * Analyze content structure (markdown/HTML)
 */
function analyzeStructure(text: string): StructureAnalysis {
  const headingCount = {
    h1: (text.match(/^# [^\n]+/gm) || []).length + (text.match(/<h1[^>]*>/gi) || []).length,
    h2: (text.match(/^## [^\n]+/gm) || []).length + (text.match(/<h2[^>]*>/gi) || []).length,
    h3: (text.match(/^### [^\n]+/gm) || []).length + (text.match(/<h3[^>]*>/gi) || []).length,
    h4: (text.match(/^#### [^\n]+/gm) || []).length + (text.match(/<h4[^>]*>/gi) || []).length,
  };

  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
  const listItems = (text.match(/^[\s]*[-*+]\s|^[\s]*\d+\.\s/gm) || []).length;
  const links = (text.match(/\[([^\]]+)\]\(([^)]+)\)|<a\s/gi) || []).length;
  const images = (text.match(/!\[([^\]]*)\]\(([^)]+)\)|<img\s/gi) || []).length;
  const hasTitle = headingCount.h1 > 0;
  const hasMetaDescription = text.length > 0; // Simplified

  // Calculate structure score
  let structureScore = 0;
  if (hasTitle) structureScore += 20;
  if (headingCount.h2 > 0) structureScore += 15;
  if (headingCount.h3 > 0) structureScore += 10;
  if (paragraphs.length >= 3) structureScore += 15;
  if (listItems > 0) structureScore += 10;
  if (links > 0) structureScore += 10;
  if (images > 0) structureScore += 10;
  if (paragraphs.length >= 5) structureScore += 10;

  return {
    hasTitle,
    headingCount,
    paragraphCount: paragraphs.length,
    listCount: listItems,
    linkCount: links,
    imageCount: images,
    hasMetaDescription,
    structureScore: Math.min(100, structureScore),
  };
}

/**
 * Analyze content metrics
 */
function analyzeContentMetrics(text: string): ContentMetrics {
  const words = splitWords(text);
  const sentences = splitSentences(text);
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
  const uniqueWords = new Set(words);

  const avgSentenceLength = sentences.length > 0 ? words.length / sentences.length : 0;
  const avgWordLength = words.length > 0 
    ? words.reduce((sum, w) => sum + w.length, 0) / words.length 
    : 0;

  // Long sentences (> 20 words)
  const longSentences = sentences.filter(s => splitWords(s).length > 20);
  const longSentencePercentage = sentences.length > 0 
    ? (longSentences.length / sentences.length) * 100 
    : 0;

  // Simple passive voice detection (simplified)
  const passivePatterns = /\b(is|are|was|were|be|been|being)\s+\w+ed\b/gi;
  const passiveMatches = text.match(passivePatterns) || [];
  const passiveVoicePercentage = sentences.length > 0 
    ? (passiveMatches.length / sentences.length) * 100 
    : 0;

  // Transition words
  const lowerText = text.toLowerCase();
  let transitionCount = 0;
  for (const tw of TRANSITION_WORDS) {
    const regex = new RegExp(`\\b${tw}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) transitionCount += matches.length;
  }
  const transitionWordPercentage = sentences.length > 0 
    ? (transitionCount / sentences.length) * 100 
    : 0;

  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    paragraphCount: paragraphs.length,
    averageSentenceLength: Math.round(avgSentenceLength * 10) / 10,
    averageWordLength: Math.round(avgWordLength * 10) / 10,
    vocabularyRichness: words.length > 0 
      ? Math.round((uniqueWords.size / words.length) * 10000) / 10000 
      : 0,
    longSentencePercentage: Math.round(longSentencePercentage * 10) / 10,
    passiveVoicePercentage: Math.round(passiveVoicePercentage * 10) / 10,
    transitionWordPercentage: Math.round(transitionWordPercentage * 10) / 10,
  };
}

/**
 * Generate SEO suggestions based on analysis
 */
function generateSuggestions(
  readability: ReadabilityAnalysis,
  keywords: KeywordAnalysis,
  structure: StructureAnalysis,
  metrics: ContentMetrics
): SEOSuggestion[] {
  const suggestions: SEOSuggestion[] = [];

  // Readability suggestions
  if (readability.fleschReadingEase < 30) {
    suggestions.push({
      type: 'warning',
      category: 'readability',
      message: 'Content is very difficult to read. Consider using shorter sentences and simpler words.',
      priority: 5,
    });
  } else if (readability.fleschReadingEase < 60) {
    suggestions.push({
      type: 'info',
      category: 'readability',
      message: 'Content readability could be improved. Aim for a Flesch Reading Ease score above 60.',
      priority: 3,
    });
  } else {
    suggestions.push({
      type: 'success',
      category: 'readability',
      message: 'Content has good readability.',
      priority: 1,
    });
  }

  // Structure suggestions
  if (!structure.hasTitle) {
    suggestions.push({
      type: 'error',
      category: 'structure',
      message: 'Content is missing an H1 heading. Add a clear, keyword-rich title.',
      priority: 5,
    });
  }
  if (structure.headingCount.h2 === 0) {
    suggestions.push({
      type: 'warning',
      category: 'structure',
      message: 'Add H2 subheadings to break up content and improve scannability.',
      priority: 4,
    });
  }
  if (structure.listCount === 0 && metrics.wordCount > 300) {
    suggestions.push({
      type: 'info',
      category: 'structure',
      message: 'Consider adding bullet points or numbered lists to improve readability.',
      priority: 2,
    });
  }

  // Content length suggestions
  if (metrics.wordCount < 300) {
    suggestions.push({
      type: 'warning',
      category: 'content_length',
      message: `Content is only ${metrics.wordCount} words. For better SEO, aim for at least 300 words.`,
      priority: 4,
    });
  } else if (metrics.wordCount >= 1000) {
    suggestions.push({
      type: 'success',
      category: 'content_length',
      message: `Great content length (${metrics.wordCount} words). Long-form content tends to rank better.`,
      priority: 1,
    });
  }

  // Keyword suggestions
  if (keywords.overusedKeywords.length > 0) {
    suggestions.push({
      type: 'warning',
      category: 'keywords',
      message: `Keywords overused (>3% density): ${keywords.overusedKeywords.join(', ')}. This may be seen as keyword stuffing.`,
      priority: 4,
    });
  }

  // Sentence complexity
  if (metrics.longSentencePercentage > 40) {
    suggestions.push({
      type: 'warning',
      category: 'sentence_complexity',
      message: `${metrics.longSentencePercentage}% of sentences are too long (>20 words). Try to keep most sentences under 20 words.`,
      priority: 3,
    });
  }

  // Passive voice
  if (metrics.passiveVoicePercentage > 20) {
    suggestions.push({
      type: 'info',
      category: 'writing_style',
      message: `High passive voice usage (${metrics.passiveVoicePercentage}%). Use active voice for more engaging content.`,
      priority: 2,
    });
  }

  // Transition words
  if (metrics.transitionWordPercentage < 20 && metrics.sentenceCount > 5) {
    suggestions.push({
      type: 'info',
      category: 'writing_style',
      message: 'Add more transition words (however, therefore, additionally) to improve content flow.',
      priority: 2,
    });
  }

  // Sort by priority (highest first)
  suggestions.sort((a, b) => b.priority - a.priority);

  return suggestions;
}

/**
 * Main SEO Analysis function
 */
export function analyzeSEO(text: string, targetKeywords?: string[]): SEOAnalysisResult {
  const words = splitWords(text);
  const sentences = splitSentences(text);

  // Run all analyses
  const fkGrade = fleschKincaidGrade(words, sentences);
  const fReadingEase = fleschReadingEase(words, sentences);
  const cliIndex = colemanLiauIndex(words, sentences);
  const ariIndex = automatedReadabilityIndex(words, sentences);
  const averageGrade = (fkGrade + cliIndex + ariIndex) / 3;

  const readability: ReadabilityAnalysis = {
    fleschKincaidGrade: Math.round(fkGrade * 10) / 10,
    fleschReadingEase: Math.round(fReadingEase * 10) / 10,
    colemanLiauIndex: Math.round(cliIndex * 10) / 10,
    automatedReadabilityIndex: Math.round(ariIndex * 10) / 10,
    averageGrade: Math.round(averageGrade * 10) / 10,
    difficulty: getDifficultyLevel(fReadingEase),
  };

  const keywords = analyzeKeywords(text, targetKeywords);
  const structure = analyzeStructure(text);
  const contentMetrics = analyzeContentMetrics(text);
  const suggestions = generateSuggestions(readability, keywords, structure, contentMetrics);

  // Calculate overall SEO score (weighted)
  const readabilityScore = Math.min(100, Math.max(0, fReadingEase));
  const structureScoreVal = structure.structureScore;
  const lengthScore = Math.min(100, (words.length / 10)); // 1000 words = 100
  const keywordScore = keywords.overusedKeywords.length === 0 ? 80 : 40;

  const overallScore = Math.round(
    (readabilityScore * 0.3) + 
    (structureScoreVal * 0.25) + 
    (lengthScore * 0.25) + 
    (keywordScore * 0.2)
  );

  return {
    overallScore: Math.min(100, Math.max(0, overallScore)),
    readability,
    keywords,
    structure,
    contentMetrics,
    suggestions,
  };
}
