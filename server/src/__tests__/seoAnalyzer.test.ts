import { analyzeSEO } from '../services/advanced/seoAnalyzer';

describe('SEO Content Analysis Engine', () => {
  const sampleContent = `# The Ultimate Guide to Web Development

In today's digital world, web development has become one of the most important skills. 
Whether you are building a personal blog or a large enterprise application, understanding 
the fundamentals of web development is essential.

## Why Learn Web Development

Web development skills are in high demand. Companies across all industries need skilled 
developers to build and maintain their online presence. The average salary for web developers 
continues to rise year over year.

### Frontend Technologies

- HTML5 provides the structure for web pages
- CSS3 handles the visual presentation and layout
- JavaScript adds interactivity and dynamic behavior

### Backend Technologies

Server-side programming handles data processing and business logic. Popular backend 
technologies include Node.js, Python, and Java.

## Getting Started

1. Learn HTML and CSS basics
2. Practice with small projects
3. Learn a JavaScript framework
4. Build a portfolio

## Conclusion

Web development is a rewarding career path with endless opportunities for growth and learning. 
Start your journey today and join the community of developers building the future of the web.`;

  describe('Overall Analysis', () => {
    it('should return an overall SEO score between 0 and 100', () => {
      const result = analyzeSEO(sampleContent);
      expect(result.overallScore).toBeGreaterThanOrEqual(0);
      expect(result.overallScore).toBeLessThanOrEqual(100);
    });

    it('should include all analysis sections', () => {
      const result = analyzeSEO(sampleContent);
      expect(result.readability).toBeDefined();
      expect(result.keywords).toBeDefined();
      expect(result.structure).toBeDefined();
      expect(result.contentMetrics).toBeDefined();
      expect(result.suggestions).toBeDefined();
    });
  });

  describe('Readability Analysis', () => {
    it('should calculate Flesch-Kincaid Grade Level', () => {
      const result = analyzeSEO(sampleContent);
      expect(result.readability.fleschKincaidGrade).toBeGreaterThan(0);
    });

    it('should calculate Flesch Reading Ease', () => {
      const result = analyzeSEO(sampleContent);
      expect(result.readability.fleschReadingEase).toBeGreaterThan(0);
    });

    it('should determine difficulty level', () => {
      const result = analyzeSEO(sampleContent);
      expect(['very_easy', 'easy', 'moderate', 'difficult', 'very_difficult']).toContain(
        result.readability.difficulty
      );
    });
  });

  describe('Keyword Analysis', () => {
    it('should extract top keywords', () => {
      const result = analyzeSEO(sampleContent);
      expect(result.keywords.topKeywords.length).toBeGreaterThan(0);
    });

    it('should calculate keyword density', () => {
      const result = analyzeSEO(sampleContent);
      const topKeyword = result.keywords.topKeywords[0];
      expect(topKeyword.density).toBeGreaterThan(0);
      expect(topKeyword.count).toBeGreaterThan(0);
      expect(topKeyword.tfidfScore).toBeGreaterThan(0);
    });

    it('should detect missing target keywords', () => {
      const result = analyzeSEO(sampleContent, ['blockchain', 'quantum']);
      expect(result.keywords.missingKeywords).toContain('blockchain');
      expect(result.keywords.missingKeywords).toContain('quantum');
    });
  });

  describe('Structure Analysis', () => {
    it('should detect headings', () => {
      const result = analyzeSEO(sampleContent);
      expect(result.structure.hasTitle).toBe(true);
      expect(result.structure.headingCount.h1).toBe(1);
      expect(result.structure.headingCount.h2).toBeGreaterThan(0);
    });

    it('should detect lists', () => {
      const result = analyzeSEO(sampleContent);
      expect(result.structure.listCount).toBeGreaterThan(0);
    });

    it('should provide a structure score', () => {
      const result = analyzeSEO(sampleContent);
      expect(result.structure.structureScore).toBeGreaterThan(0);
    });
  });

  describe('Content Metrics', () => {
    it('should calculate word count', () => {
      const result = analyzeSEO(sampleContent);
      expect(result.contentMetrics.wordCount).toBeGreaterThan(100);
    });

    it('should calculate vocabulary richness', () => {
      const result = analyzeSEO(sampleContent);
      expect(result.contentMetrics.vocabularyRichness).toBeGreaterThan(0);
      expect(result.contentMetrics.vocabularyRichness).toBeLessThanOrEqual(1);
    });
  });

  describe('SEO Suggestions', () => {
    it('should provide suggestions', () => {
      const result = analyzeSEO(sampleContent);
      expect(result.suggestions.length).toBeGreaterThan(0);
    });

    it('should include suggestion types', () => {
      const result = analyzeSEO(sampleContent);
      for (const suggestion of result.suggestions) {
        expect(['error', 'warning', 'info', 'success']).toContain(suggestion.type);
        expect(suggestion.message).toBeTruthy();
        expect(suggestion.priority).toBeGreaterThan(0);
      }
    });

    it('should warn about short content', () => {
      const result = analyzeSEO('Short text.');
      const hasLengthWarning = result.suggestions.some(s => s.category === 'content_length');
      expect(hasLengthWarning).toBe(true);
    });
  });
});
