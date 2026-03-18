/**
 * Advanced Feature: Plagiarism Detection Engine
 * 
 * Implements multiple text similarity algorithms to detect potential plagiarism
 * in generated content. This is an advanced NLP feature that combines:
 * 
 * 1. Cosine Similarity - Vector space model comparison using TF-IDF
 * 2. Jaccard Similarity - Set-based comparison of word n-grams
 * 3. Longest Common Subsequence (LCS) - Dynamic programming approach
 * 4. Fingerprinting (Winnowing Algorithm) - Document fingerprinting for near-duplicate detection
 * 
 * These algorithms are used together to provide a comprehensive plagiarism score.
 */

interface PlagiarismResult {
  overallScore: number;       // 0-1, where 1 = identical
  cosineSimilarity: number;
  jaccardSimilarity: number;
  lcsRatio: number;
  fingerprintMatch: number;
  matchedSegments: MatchedSegment[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface MatchedSegment {
  sourceText: string;
  matchText: string;
  similarity: number;
  startIndex: number;
  endIndex: number;
}

/**
 * Tokenize text into words, removing punctuation and converting to lowercase
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 0);
}

/**
 * Generate n-grams from an array of tokens
 */
function generateNGrams(tokens: string[], n: number): string[] {
  const ngrams: string[] = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    ngrams.push(tokens.slice(i, i + n).join(' '));
  }
  return ngrams;
}

/**
 * Calculate Term Frequency (TF) for a document
 */
function calculateTF(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  const totalTokens = tokens.length;
  
  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }
  
  // Normalize by document length
  for (const [term, count] of tf.entries()) {
    tf.set(term, count / totalTokens);
  }
  
  return tf;
}

/**
 * Calculate Inverse Document Frequency (IDF) across documents
 * Uses smoothed IDF: log(1 + totalDocs / (1 + df)) to avoid zero values
 */
function calculateIDF(documents: string[][]): Map<string, number> {
  const idf = new Map<string, number>();
  const totalDocs = documents.length;
  const docFrequency = new Map<string, number>();

  for (const doc of documents) {
    const uniqueTerms = new Set(doc);
    for (const term of uniqueTerms) {
      docFrequency.set(term, (docFrequency.get(term) || 0) + 1);
    }
  }

  for (const [term, df] of docFrequency.entries()) {
    // Smoothed IDF to avoid zero for terms present in all documents
    idf.set(term, Math.log(1 + totalDocs / (1 + df)));
  }

  return idf;
}

/**
 * Calculate TF-IDF vector for a document
 */
function calculateTFIDF(tokens: string[], idf: Map<string, number>): Map<string, number> {
  const tf = calculateTF(tokens);
  const tfidf = new Map<string, number>();

  for (const [term, tfValue] of tf.entries()) {
    const idfValue = idf.get(term) || 0;
    tfidf.set(term, tfValue * idfValue);
  }

  return tfidf;
}

/**
 * Algorithm 1: Cosine Similarity using TF-IDF vectors
 * 
 * Measures the cosine of the angle between two document vectors in TF-IDF space.
 * Range: 0 (completely different) to 1 (identical)
 * 
 * Formula: cos(θ) = (A · B) / (||A|| × ||B||)
 */
export function cosineSimilarity(text1: string, text2: string): number {
  const tokens1 = tokenize(text1);
  const tokens2 = tokenize(text2);

  if (tokens1.length === 0 || tokens2.length === 0) return 0;

  const idf = calculateIDF([tokens1, tokens2]);
  const tfidf1 = calculateTFIDF(tokens1, idf);
  const tfidf2 = calculateTFIDF(tokens2, idf);

  // Get all unique terms
  const allTerms = new Set([...tfidf1.keys(), ...tfidf2.keys()]);

  // Calculate dot product and magnitudes
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (const term of allTerms) {
    const val1 = tfidf1.get(term) || 0;
    const val2 = tfidf2.get(term) || 0;
    dotProduct += val1 * val2;
    magnitude1 += val1 * val1;
    magnitude2 += val2 * val2;
  }

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  if (magnitude1 === 0 || magnitude2 === 0) return 0;

  return dotProduct / (magnitude1 * magnitude2);
}

/**
 * Algorithm 2: Jaccard Similarity using word n-grams
 * 
 * Measures similarity as the size of intersection divided by size of union
 * of n-gram sets from both documents.
 * 
 * Formula: J(A,B) = |A ∩ B| / |A ∪ B|
 */
export function jaccardSimilarity(text1: string, text2: string, n: number = 3): number {
  const tokens1 = tokenize(text1);
  const tokens2 = tokenize(text2);

  if (tokens1.length < n || tokens2.length < n) return 0;

  const ngrams1 = new Set(generateNGrams(tokens1, n));
  const ngrams2 = new Set(generateNGrams(tokens2, n));

  const intersection = new Set([...ngrams1].filter(x => ngrams2.has(x)));
  const union = new Set([...ngrams1, ...ngrams2]);

  if (union.size === 0) return 0;

  return intersection.size / union.size;
}

/**
 * Algorithm 3: Longest Common Subsequence (LCS) Ratio
 * 
 * Uses dynamic programming to find the longest common subsequence between
 * two texts, then normalizes by the length of the longer text.
 * 
 * Time Complexity: O(m × n) where m, n are lengths of the two texts
 * Space Complexity: O(min(m, n)) using space optimization
 */
export function lcsRatio(text1: string, text2: string): number {
  const tokens1 = tokenize(text1);
  const tokens2 = tokenize(text2);

  if (tokens1.length === 0 || tokens2.length === 0) return 0;

  const m = tokens1.length;
  const n = tokens2.length;

  // Space-optimized DP: only keep two rows
  let prev = new Array(n + 1).fill(0);
  let curr = new Array(n + 1).fill(0);

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (tokens1[i - 1] === tokens2[j - 1]) {
        curr[j] = prev[j - 1] + 1;
      } else {
        curr[j] = Math.max(prev[j], curr[j - 1]);
      }
    }
    [prev, curr] = [curr, new Array(n + 1).fill(0)];
  }

  const lcsLength = prev[n];
  const maxLength = Math.max(m, n);

  return lcsLength / maxLength;
}

/**
 * Algorithm 4: Winnowing Algorithm for Document Fingerprinting
 * 
 * Creates a set of hash fingerprints for each document using the winnowing
 * algorithm, then compares fingerprint sets.
 * 
 * Steps:
 * 1. Generate k-grams (character-level)
 * 2. Hash each k-gram
 * 3. Select minimum hash from each window (winnowing)
 * 4. Compare fingerprint sets using Jaccard similarity
 */
export function fingerprintSimilarity(text1: string, text2: string, k: number = 5, windowSize: number = 4): number {
  function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  function winnow(text: string): Set<number> {
    const normalized = text.toLowerCase().replace(/\s+/g, ' ').trim();
    if (normalized.length < k) return new Set();

    // Generate k-grams and hash them
    const hashes: number[] = [];
    for (let i = 0; i <= normalized.length - k; i++) {
      hashes.push(hashString(normalized.substring(i, i + k)));
    }

    // Winnowing: select minimum hash from each window
    const fingerprints = new Set<number>();
    for (let i = 0; i <= hashes.length - windowSize; i++) {
      const window = hashes.slice(i, i + windowSize);
      fingerprints.add(Math.min(...window));
    }

    return fingerprints;
  }

  const fp1 = winnow(text1);
  const fp2 = winnow(text2);

  if (fp1.size === 0 || fp2.size === 0) return 0;

  const intersection = new Set([...fp1].filter(x => fp2.has(x)));
  const union = new Set([...fp1, ...fp2]);

  return intersection.size / union.size;
}

/**
 * Find matched segments between two texts
 */
function findMatchedSegments(text1: string, text2: string, minLength: number = 5): MatchedSegment[] {
  const segments: MatchedSegment[] = [];
  const words1 = text1.split(/\s+/);
  const words2 = text2.split(/\s+/);

  for (let i = 0; i <= words1.length - minLength; i++) {
    for (let j = 0; j <= words2.length - minLength; j++) {
      let matchLen = 0;
      while (
        i + matchLen < words1.length &&
        j + matchLen < words2.length &&
        words1[i + matchLen].toLowerCase() === words2[j + matchLen].toLowerCase()
      ) {
        matchLen++;
      }

      if (matchLen >= minLength) {
        const matchedText = words1.slice(i, i + matchLen).join(' ');
        segments.push({
          sourceText: matchedText,
          matchText: words2.slice(j, j + matchLen).join(' '),
          similarity: 1.0,
          startIndex: text1.indexOf(matchedText),
          endIndex: text1.indexOf(matchedText) + matchedText.length,
        });
        i += matchLen - 1; // Skip ahead
        break;
      }
    }
  }

  return segments;
}

/**
 * Determine risk level based on overall plagiarism score
 */
function determineRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
  if (score < 0.2) return 'low';
  if (score < 0.4) return 'medium';
  if (score < 0.7) return 'high';
  return 'critical';
}

/**
 * Main plagiarism detection function that combines all algorithms
 */
export function detectPlagiarism(sourceText: string, comparisonText: string): PlagiarismResult {
  const cosine = cosineSimilarity(sourceText, comparisonText);
  const jaccard = jaccardSimilarity(sourceText, comparisonText);
  const lcs = lcsRatio(sourceText, comparisonText);
  const fingerprint = fingerprintSimilarity(sourceText, comparisonText);
  const matchedSegments = findMatchedSegments(sourceText, comparisonText);

  // Weighted average: cosine (30%), jaccard (25%), LCS (25%), fingerprint (20%)
  const overallScore = (cosine * 0.30) + (jaccard * 0.25) + (lcs * 0.25) + (fingerprint * 0.20);

  return {
    overallScore: Math.round(overallScore * 10000) / 10000,
    cosineSimilarity: Math.round(cosine * 10000) / 10000,
    jaccardSimilarity: Math.round(jaccard * 10000) / 10000,
    lcsRatio: Math.round(lcs * 10000) / 10000,
    fingerprintMatch: Math.round(fingerprint * 10000) / 10000,
    matchedSegments,
    riskLevel: determineRiskLevel(overallScore),
  };
}

/**
 * Batch plagiarism check against multiple reference documents
 */
export function batchPlagiarismCheck(
  sourceText: string, 
  referenceTexts: { id: string; text: string; title?: string }[]
): { sourceText: string; results: (PlagiarismResult & { referenceId: string; referenceTitle?: string })[] } {
  const results = referenceTexts.map(ref => ({
    ...detectPlagiarism(sourceText, ref.text),
    referenceId: ref.id,
    referenceTitle: ref.title,
  }));

  // Sort by overall score descending (most similar first)
  results.sort((a, b) => b.overallScore - a.overallScore);

  return { sourceText, results };
}
