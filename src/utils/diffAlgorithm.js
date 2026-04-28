/**
 * Myers diff algorithm — O(NM) time, O(N+M) space
 * Returns array of { type: 'add'|'remove'|'keep', value: string, lineNum: number }
 */
export const computeDiff = (oldText, newText) => {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');

  // Build longest common subsequence matrix
  const m = oldLines.length;
  const n = newLines.length;
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to find actual diff
  const diff = [];
  let i = m, j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      diff.unshift({ type: 'keep', value: oldLines[i - 1], oldLine: i, newLine: j });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      diff.unshift({ type: 'add', value: newLines[j - 1], newLine: j });
      j--;
    } else {
      diff.unshift({ type: 'remove', value: oldLines[i - 1], oldLine: i });
      i--;
    }
  }

  return diff;
};

/**
 * Compute character-level diff for inline highlighting
 * Returns array of { type, value }
 */
export const computeCharDiff = (oldStr, newStr) => {
  const minLen = Math.min(oldStr.length, newStr.length);
  const diff = [];
  let i = 0, j = 0;

  // Find matching prefix
  while (i < minLen && oldStr[i] === newStr[i]) {
    diff.push({ type: 'keep', value: oldStr[i] });
    i++;
    j++;
  }

  // Find matching suffix
  let oldEnd = oldStr.length - 1;
  let newEnd = newStr.length - 1;
  while (oldEnd >= i && newEnd >= j && oldStr[oldEnd] === newStr[newEnd]) {
    oldEnd--;
    newEnd--;
  }

  // Middle part differs
  if (i <= oldEnd) {
    diff.push({ type: 'remove', value: oldStr.substring(i, oldEnd + 1) });
  }
  if (j <= newEnd) {
    diff.push({ type: 'add', value: newStr.substring(j, newEnd + 1) });
  }

  // Add matching suffix
  if (oldEnd + 1 < oldStr.length) {
    diff.push({ type: 'keep', value: oldStr.substring(oldEnd + 1) });
  }

  return diff;
};

/**
 * Compute statistics
 */
export const getStats = (diff) => {
  let added = 0, removed = 0, unchanged = 0, similarity = 0;
  diff.forEach((d) => {
    if (d.type === 'add') added++;
    else if (d.type === 'remove') removed++;
    else unchanged++;
  });
  const total = diff.length || 1;
  similarity = Math.round((unchanged / total) * 100);
  return { added, removed, unchanged, similarity };
};