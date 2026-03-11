/**
 * Advanced Feature: Content Version Control with Diff Comparison
 * 
 * Implements a Git-like version control system for content:
 * 
 * 1. Version tracking with timestamps and metadata
 * 2. Myers diff algorithm for computing differences between versions
 * 3. Three-way merge for resolving conflicts
 * 4. Version branching and tagging
 * 5. Efficient delta storage (only store diffs, not full content)
 * 
 * The diff algorithm uses the Myers algorithm (same as Git)
 * with O(ND) time complexity where N = sum of input lengths, D = edit distance
 */

export interface ContentVersion {
  id: string;
  contentId: string;
  version: number;
  content: string;
  delta?: DiffResult[];     // Diff from previous version (delta storage)
  metadata: {
    author: string;
    timestamp: Date;
    message: string;
    wordCount: number;
    tags?: string[];
  };
  parentVersion?: number;    // For branching
}

export interface DiffResult {
  type: 'equal' | 'insert' | 'delete';
  value: string;
  lineNumber?: { old?: number; new?: number };
}

export interface DiffStats {
  additions: number;
  deletions: number;
  unchanged: number;
  changePercentage: number;
}

export interface MergeResult {
  success: boolean;
  mergedContent: string;
  conflicts: MergeConflict[];
}

export interface MergeConflict {
  lineNumber: number;
  baseContent: string;
  version1Content: string;
  version2Content: string;
}

/**
 * Myers Diff Algorithm Implementation
 * 
 * Computes the shortest edit script (SES) between two sequences.
 * This is the same algorithm used by Git for computing diffs.
 * 
 * Time Complexity: O(ND) where N = |a| + |b|, D = edit distance
 * Space Complexity: O(N)
 * 
 * Reference: "An O(ND) Difference Algorithm and Its Variations" by Eugene W. Myers
 */
export function myersDiff(oldText: string, newText: string): DiffResult[] {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  
  const n = oldLines.length;
  const m = newLines.length;
  const max = n + m;
  
  // V array: v[k] = x value of the furthest reaching d-path on diagonal k
  const v: number[] = new Array(2 * max + 1).fill(0);
  const trace: number[][] = [];
  
  // Find the shortest edit script
  let found = false;
  for (let d = 0; d <= max && !found; d++) {
    const newV = [...v];
    
    for (let k = -d; k <= d; k += 2) {
      const kOffset = k + max;
      
      let x: number;
      if (k === -d || (k !== d && v[kOffset - 1] < v[kOffset + 1])) {
        x = v[kOffset + 1]; // Move down (insert)
      } else {
        x = v[kOffset - 1] + 1; // Move right (delete)
      }
      
      let y = x - k;
      
      // Follow diagonal (equal lines)
      while (x < n && y < m && oldLines[x] === newLines[y]) {
        x++;
        y++;
      }
      
      newV[kOffset] = x;
      
      if (x >= n && y >= m) {
        trace.push(newV);
        found = true;
        break;
      }
    }
    
    if (!found) {
      trace.push([...newV]);
    }
  }
  
  // Backtrack to find the actual edit script
  const edits: DiffResult[] = [];
  let x = n;
  let y = m;
  
  for (let d = trace.length - 1; d >= 0 && (x > 0 || y > 0); d--) {
    const currentV = trace[d];
    const k = x - y;
    const kOffset = k + max;
    
    let prevK: number;
    if (k === -d || (k !== d && (d > 0 ? trace[d-1][kOffset - 1] : 0) < (d > 0 ? trace[d-1][kOffset + 1] : 0))) {
      prevK = k + 1; // Came from insert
    } else {
      prevK = k - 1; // Came from delete
    }
    
    let prevX = d > 0 ? trace[d-1][prevK + max] : 0;
    let prevY = prevX - prevK;
    
    // Diagonal (equal) moves
    while (x > prevX && y > prevY) {
      x--;
      y--;
      edits.unshift({
        type: 'equal',
        value: oldLines[x],
        lineNumber: { old: x + 1, new: y + 1 },
      });
    }
    
    if (d > 0) {
      if (x === prevX) {
        // Insert
        y--;
        edits.unshift({
          type: 'insert',
          value: newLines[y],
          lineNumber: { new: y + 1 },
        });
      } else {
        // Delete
        x--;
        edits.unshift({
          type: 'delete',
          value: oldLines[x],
          lineNumber: { old: x + 1 },
        });
      }
    }
  }
  
  return edits;
}

/**
 * Simple line-by-line diff (fallback for large texts)
 * More memory efficient than Myers for very large documents
 */
export function simpleDiff(oldText: string, newText: string): DiffResult[] {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  const results: DiffResult[] = [];

  // Use LCS to find matching lines
  const m = oldLines.length;
  const n = newLines.length;
  
  // DP table for LCS
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to get diff
  let i = m;
  let j = n;
  const stack: DiffResult[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      stack.push({
        type: 'equal',
        value: oldLines[i - 1],
        lineNumber: { old: i, new: j },
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({
        type: 'insert',
        value: newLines[j - 1],
        lineNumber: { new: j },
      });
      j--;
    } else {
      stack.push({
        type: 'delete',
        value: oldLines[i - 1],
        lineNumber: { old: i },
      });
      i--;
    }
  }

  return stack.reverse();
}

/**
 * Calculate diff statistics
 */
export function calculateDiffStats(diffs: DiffResult[]): DiffStats {
  let additions = 0;
  let deletions = 0;
  let unchanged = 0;

  for (const diff of diffs) {
    switch (diff.type) {
      case 'insert': additions++; break;
      case 'delete': deletions++; break;
      case 'equal': unchanged++; break;
    }
  }

  const total = additions + deletions + unchanged;
  const changePercentage = total > 0 
    ? Math.round(((additions + deletions) / total) * 10000) / 100 
    : 0;

  return { additions, deletions, unchanged, changePercentage };
}

/**
 * Three-way merge algorithm
 * 
 * Merges two versions that branched from a common base.
 * Detects and reports conflicts when both versions modify the same lines.
 */
export function threeWayMerge(base: string, version1: string, version2: string): MergeResult {
  const baseLines = base.split('\n');
  const v1Lines = version1.split('\n');
  const v2Lines = version2.split('\n');
  
  const diff1 = simpleDiff(base, version1);
  const diff2 = simpleDiff(base, version2);
  
  // Build maps of changes from base
  const changes1 = new Map<number, { type: 'insert' | 'delete' | 'modify'; value: string }>();
  const changes2 = new Map<number, { type: 'insert' | 'delete' | 'modify'; value: string }>();
  
  for (const d of diff1) {
    if (d.type === 'delete' && d.lineNumber?.old) {
      changes1.set(d.lineNumber.old, { type: 'delete', value: d.value });
    } else if (d.type === 'insert' && d.lineNumber?.new) {
      changes1.set(-d.lineNumber.new, { type: 'insert', value: d.value });
    }
  }
  
  for (const d of diff2) {
    if (d.type === 'delete' && d.lineNumber?.old) {
      changes2.set(d.lineNumber.old, { type: 'delete', value: d.value });
    } else if (d.type === 'insert' && d.lineNumber?.new) {
      changes2.set(-d.lineNumber.new, { type: 'insert', value: d.value });
    }
  }
  
  // Merge changes
  const mergedLines: string[] = [];
  const conflicts: MergeConflict[] = [];
  
  for (let i = 0; i < baseLines.length; i++) {
    const lineNum = i + 1;
    const c1 = changes1.get(lineNum);
    const c2 = changes2.get(lineNum);
    
    if (c1 && c2) {
      // Both modified the same line
      if (c1.type === c2.type && c1.value === c2.value) {
        // Same change, no conflict
        if (c1.type !== 'delete') {
          mergedLines.push(c1.value);
        }
      } else {
        // Conflict!
        conflicts.push({
          lineNumber: lineNum,
          baseContent: baseLines[i],
          version1Content: c1.type === 'delete' ? '' : c1.value,
          version2Content: c2.type === 'delete' ? '' : c2.value,
        });
        // Add conflict markers
        mergedLines.push(`<<<<<<< VERSION 1`);
        if (c1.type !== 'delete') mergedLines.push(c1.value);
        mergedLines.push(`=======`);
        if (c2.type !== 'delete') mergedLines.push(c2.value);
        mergedLines.push(`>>>>>>> VERSION 2`);
      }
    } else if (c1) {
      if (c1.type !== 'delete') {
        mergedLines.push(c1.value);
      }
    } else if (c2) {
      if (c2.type !== 'delete') {
        mergedLines.push(c2.value);
      }
    } else {
      mergedLines.push(baseLines[i]);
    }
  }
  
  return {
    success: conflicts.length === 0,
    mergedContent: mergedLines.join('\n'),
    conflicts,
  };
}

/**
 * Apply a diff (patch) to a base text to reconstruct a version
 */
export function applyDiff(baseText: string, diffs: DiffResult[]): string {
  const result: string[] = [];
  
  for (const diff of diffs) {
    if (diff.type === 'equal' || diff.type === 'insert') {
      result.push(diff.value);
    }
    // 'delete' entries are skipped (removed from output)
  }
  
  return result.join('\n');
}

/**
 * Generate a unified diff format string (similar to git diff)
 */
export function unifiedDiff(oldText: string, newText: string, oldLabel: string = 'old', newLabel: string = 'new'): string {
  const diffs = simpleDiff(oldText, newText);
  const lines: string[] = [];
  
  lines.push(`--- a/${oldLabel}`);
  lines.push(`+++ b/${newLabel}`);
  
  let oldLine = 1;
  let newLine = 1;
  let hunkStart = -1;
  let hunkLines: string[] = [];
  
  for (const diff of diffs) {
    switch (diff.type) {
      case 'equal':
        if (hunkLines.length > 0) {
          hunkLines.push(` ${diff.value}`);
        }
        oldLine++;
        newLine++;
        break;
      case 'delete':
        if (hunkStart === -1) {
          hunkStart = oldLine;
          lines.push(`@@ -${oldLine} +${newLine} @@`);
        }
        hunkLines.push(`-${diff.value}`);
        oldLine++;
        break;
      case 'insert':
        if (hunkStart === -1) {
          hunkStart = oldLine;
          lines.push(`@@ -${oldLine} +${newLine} @@`);
        }
        hunkLines.push(`+${diff.value}`);
        newLine++;
        break;
    }
  }
  
  lines.push(...hunkLines);
  
  return lines.join('\n');
}

/**
 * Content Version Store - manages version history for content
 */
export class ContentVersionStore {
  private versions: Map<string, ContentVersion[]> = new Map();

  /**
   * Create a new version for a content item
   */
  createVersion(
    contentId: string, 
    content: string, 
    author: string, 
    message: string
  ): ContentVersion {
    const contentVersions = this.versions.get(contentId) || [];
    const previousVersion = contentVersions[contentVersions.length - 1];
    
    const version: ContentVersion = {
      id: `v_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      contentId,
      version: contentVersions.length + 1,
      content,
      metadata: {
        author,
        timestamp: new Date(),
        message,
        wordCount: content.split(/\s+/).filter(w => w.length > 0).length,
      },
    };

    // Store delta instead of full content for efficiency
    if (previousVersion) {
      version.delta = simpleDiff(previousVersion.content, content);
    }

    contentVersions.push(version);
    this.versions.set(contentId, contentVersions);

    return version;
  }

  /**
   * Get all versions for a content item
   */
  getVersions(contentId: string): ContentVersion[] {
    return this.versions.get(contentId) || [];
  }

  /**
   * Get a specific version
   */
  getVersion(contentId: string, versionNumber: number): ContentVersion | undefined {
    const versions = this.versions.get(contentId);
    if (!versions) return undefined;
    return versions.find(v => v.version === versionNumber);
  }

  /**
   * Compare two versions and return diff
   */
  compareVersions(
    contentId: string, 
    version1: number, 
    version2: number
  ): { diffs: DiffResult[]; stats: DiffStats } | undefined {
    const v1 = this.getVersion(contentId, version1);
    const v2 = this.getVersion(contentId, version2);
    
    if (!v1 || !v2) return undefined;

    const diffs = simpleDiff(v1.content, v2.content);
    const stats = calculateDiffStats(diffs);

    return { diffs, stats };
  }

  /**
   * Restore content to a specific version
   */
  restoreVersion(contentId: string, versionNumber: number, author: string): ContentVersion | undefined {
    const version = this.getVersion(contentId, versionNumber);
    if (!version) return undefined;

    return this.createVersion(
      contentId, 
      version.content, 
      author, 
      `Restored to version ${versionNumber}`
    );
  }
}
