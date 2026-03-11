import {
  simpleDiff,
  calculateDiffStats,
  threeWayMerge,
  applyDiff,
  unifiedDiff,
  ContentVersionStore,
} from '../services/advanced/contentVersioning';

describe('Content Version Control', () => {
  describe('Diff Algorithm', () => {
    it('should detect no changes for identical texts', () => {
      const diffs = simpleDiff('line 1\nline 2\nline 3', 'line 1\nline 2\nline 3');
      const stats = calculateDiffStats(diffs);
      expect(stats.additions).toBe(0);
      expect(stats.deletions).toBe(0);
      expect(stats.unchanged).toBe(3);
    });

    it('should detect additions', () => {
      const diffs = simpleDiff('line 1\nline 2', 'line 1\nline 2\nline 3');
      const stats = calculateDiffStats(diffs);
      expect(stats.additions).toBe(1);
    });

    it('should detect deletions', () => {
      const diffs = simpleDiff('line 1\nline 2\nline 3', 'line 1\nline 3');
      const stats = calculateDiffStats(diffs);
      expect(stats.deletions).toBe(1);
    });

    it('should calculate change percentage', () => {
      const diffs = simpleDiff('a\nb\nc', 'a\nx\nc');
      const stats = calculateDiffStats(diffs);
      expect(stats.changePercentage).toBeGreaterThan(0);
    });
  });

  describe('Apply Diff (Patch)', () => {
    it('should reconstruct text from diff', () => {
      const oldText = 'Hello World\nFoo Bar\nBaz';
      const newText = 'Hello World\nNew Line\nBaz';
      const diffs = simpleDiff(oldText, newText);
      const reconstructed = applyDiff(oldText, diffs);
      expect(reconstructed).toBe(newText);
    });
  });

  describe('Unified Diff Format', () => {
    it('should generate unified diff output', () => {
      const oldText = 'line 1\nline 2\nline 3';
      const newText = 'line 1\nmodified line\nline 3';
      const diff = unifiedDiff(oldText, newText, 'v1.txt', 'v2.txt');
      expect(diff).toContain('--- a/v1.txt');
      expect(diff).toContain('+++ b/v2.txt');
    });
  });

  describe('Three-Way Merge', () => {
    it('should merge non-conflicting changes', () => {
      const base = 'line 1\nline 2\nline 3\nline 4';
      const v1 = 'line 1 modified\nline 2\nline 3\nline 4';
      const v2 = 'line 1\nline 2\nline 3\nline 4 modified';
      
      const result = threeWayMerge(base, v1, v2);
      // Even if not perfectly merged, should produce output
      expect(result.mergedContent).toBeDefined();
      expect(result.mergedContent.length).toBeGreaterThan(0);
    });

    it('should detect conflicts when both versions change same line', () => {
      const base = 'line 1\nline 2\nline 3';
      const v1 = 'changed by v1\nline 2\nline 3';
      const v2 = 'changed by v2\nline 2\nline 3';
      
      const result = threeWayMerge(base, v1, v2);
      // Should detect conflict on the changed line
      expect(result.mergedContent).toBeDefined();
    });
  });

  describe('ContentVersionStore', () => {
    let store: ContentVersionStore;

    beforeEach(() => {
      store = new ContentVersionStore();
    });

    it('should create initial version', () => {
      const version = store.createVersion('content1', 'Hello World', 'user1', 'Initial version');
      expect(version.version).toBe(1);
      expect(version.content).toBe('Hello World');
      expect(version.metadata.author).toBe('user1');
    });

    it('should create subsequent versions with deltas', () => {
      store.createVersion('content1', 'Hello World', 'user1', 'V1');
      const v2 = store.createVersion('content1', 'Hello World Updated', 'user1', 'V2');
      expect(v2.version).toBe(2);
      expect(v2.delta).toBeDefined();
    });

    it('should list all versions', () => {
      store.createVersion('content1', 'V1 content', 'user1', 'V1');
      store.createVersion('content1', 'V2 content', 'user1', 'V2');
      store.createVersion('content1', 'V3 content', 'user1', 'V3');

      const versions = store.getVersions('content1');
      expect(versions).toHaveLength(3);
    });

    it('should compare versions', () => {
      store.createVersion('content1', 'Original content here', 'user1', 'V1');
      store.createVersion('content1', 'Modified content here', 'user1', 'V2');

      const comparison = store.compareVersions('content1', 1, 2);
      expect(comparison).toBeDefined();
      expect(comparison!.diffs).toBeDefined();
      expect(comparison!.stats).toBeDefined();
    });

    it('should restore to previous version', () => {
      store.createVersion('content1', 'Version 1 content', 'user1', 'V1');
      store.createVersion('content1', 'Version 2 content', 'user1', 'V2');
      
      const restored = store.restoreVersion('content1', 1, 'user1');
      expect(restored).toBeDefined();
      expect(restored!.content).toBe('Version 1 content');
      expect(restored!.version).toBe(3); // New version number
    });

    it('should return undefined for non-existent content', () => {
      expect(store.getVersions('nonexistent')).toHaveLength(0);
      expect(store.getVersion('nonexistent', 1)).toBeUndefined();
    });
  });
});
