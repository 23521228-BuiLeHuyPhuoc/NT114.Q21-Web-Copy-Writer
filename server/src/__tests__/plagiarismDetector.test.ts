import {
  cosineSimilarity,
  jaccardSimilarity,
  lcsRatio,
  fingerprintSimilarity,
  detectPlagiarism,
  batchPlagiarismCheck,
} from '../services/advanced/plagiarismDetector';

describe('Plagiarism Detection Engine', () => {
  const text1 = 'The quick brown fox jumps over the lazy dog in the garden near the old house';
  const text2 = 'The quick brown fox jumps over the lazy dog in the garden near the old house';
  const text3 = 'A completely different sentence about programming and web development';
  const text4 = 'The fast brown fox leaps over the sleepy dog in the yard near the old building';

  describe('Cosine Similarity (TF-IDF)', () => {
    it('should return 1 for identical texts', () => {
      const score = cosineSimilarity(text1, text2);
      expect(score).toBeCloseTo(1, 1);
    });

    it('should return low score for completely different texts', () => {
      const score = cosineSimilarity(text1, text3);
      expect(score).toBeLessThan(0.3);
    });

    it('should return moderate score for similar texts', () => {
      const score = cosineSimilarity(text1, text4);
      expect(score).toBeGreaterThan(0.3);
      expect(score).toBeLessThan(1);
    });

    it('should return 0 for empty texts', () => {
      expect(cosineSimilarity('', '')).toBe(0);
      expect(cosineSimilarity('hello', '')).toBe(0);
    });
  });

  describe('Jaccard Similarity (N-gram)', () => {
    it('should return 1 for identical texts', () => {
      const score = jaccardSimilarity(text1, text2);
      expect(score).toBe(1);
    });

    it('should return 0 for completely different texts', () => {
      const score = jaccardSimilarity(text1, text3);
      expect(score).toBeLessThan(0.1);
    });

    it('should handle short texts gracefully', () => {
      expect(jaccardSimilarity('hi', 'hello', 3)).toBe(0);
    });
  });

  describe('LCS Ratio (Dynamic Programming)', () => {
    it('should return 1 for identical texts', () => {
      const score = lcsRatio(text1, text2);
      expect(score).toBe(1);
    });

    it('should return low score for different texts', () => {
      const score = lcsRatio(text1, text3);
      expect(score).toBeLessThan(0.3);
    });

    it('should return 0 for empty texts', () => {
      expect(lcsRatio('', '')).toBe(0);
    });
  });

  describe('Fingerprint Similarity (Winnowing)', () => {
    it('should return high score for identical texts', () => {
      const score = fingerprintSimilarity(text1, text2);
      expect(score).toBeGreaterThan(0.8);
    });

    it('should return low score for different texts', () => {
      const score = fingerprintSimilarity(text1, text3);
      expect(score).toBeLessThan(0.3);
    });
  });

  describe('Combined Plagiarism Detection', () => {
    it('should detect identical content as critical', () => {
      const result = detectPlagiarism(text1, text2);
      expect(result.riskLevel).toBe('critical');
      expect(result.overallScore).toBeGreaterThanOrEqual(0.7);
    });

    it('should classify different content as low risk', () => {
      const result = detectPlagiarism(text1, text3);
      expect(result.riskLevel).toBe('low');
      expect(result.overallScore).toBeLessThan(0.2);
    });

    it('should return all algorithm scores', () => {
      const result = detectPlagiarism(text1, text4);
      expect(result.cosineSimilarity).toBeDefined();
      expect(result.jaccardSimilarity).toBeDefined();
      expect(result.lcsRatio).toBeDefined();
      expect(result.fingerprintMatch).toBeDefined();
      expect(result.matchedSegments).toBeDefined();
    });
  });

  describe('Batch Plagiarism Check', () => {
    it('should check against multiple reference documents', () => {
      const result = batchPlagiarismCheck(text1, [
        { id: '1', text: text2, title: 'Identical' },
        { id: '2', text: text3, title: 'Different' },
        { id: '3', text: text4, title: 'Similar' },
      ]);

      expect(result.results).toHaveLength(3);
      // Results should be sorted by score descending
      expect(result.results[0].overallScore).toBeGreaterThanOrEqual(result.results[1].overallScore);
      expect(result.results[1].overallScore).toBeGreaterThanOrEqual(result.results[2].overallScore);
    });
  });
});
