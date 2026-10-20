// 18_Recursion_and_Backtracking.ts

/* ============================================================
 *  📘 RECURSION & BACKTRACKING IN TYPESCRIPT — COMPLETE COVERAGE
 *
 *  BACKTRACKING is systematic trial-and-error: build a solution
 *  one choice at a time; if a choice leads to a dead end, UNDO
 *  it and try the next. It's DFS over the space of partial
 *  solutions, with pruning. Backtracking solves constraint
 *  problems: permutations, combinations, sudoku, N-queens,
 *  word search, subset sums.
 *
 *  This file covers: backtracking template, permutations,
 *  combinations, subsets, N-queens, sudoku, word search,
 *  palindrome partitioning, and the pruning principles that
 *  keep the search space manageable.
 *
 *  Sections:
 *   1. Backtracking vs plain recursion
 *   2. The universal template
 *   3. Subsets (power set)
 *   4. Permutations
 *   5. Combinations (n choose k)
 *   6. Combination sum (with pruning)
 *   7. Palindrome partitioning
 *   8. N-Queens (classic)
 *   9. Sudoku solver (harder)
 *  10. Word search in a grid
 *  11. Pattern recognition & pruning guide
 *  12. Edge cases, pitfalls, version notes
 * ============================================================ */


/* ============================================================
 *  1️⃣ BACKTRACKING VS PLAIN RECURSION
 * ============================================================ */
// 🔹 Plain recursion: solve a subproblem, return its answer.
// 🔹 Backtracking: EXPLORE choices, PRUNE, and UNDO.
// 🔸 Backtracking is recursion + a mutable "path" + undo step.
// 🎯 It's brute force with pruning — often exponential worst
//    case, but the early exit makes real cases tractable.

// 🧠 Every backtracking problem has:
//     - a CHOICE at each step (which element, which digit, ...)
//     - CONSTRAINTS that prune invalid choices
//     - a GOAL state (path is a valid complete solution)
//     - an UNDO step (restore state before returning)


/* ============================================================
 *  2️⃣ THE UNIVERSAL TEMPLATE
 * ============================================================ */
// 🔹 Pattern (memorise this):

// function backtrack(path: T[], choices: T[], result: T[][]): void {
//   if (isGoal(path)) {                    // ✅ solution reached
//     result.push([...path]);              // snapshot!
//     return;
//   }
//   for (const c of choices) {
//     if (!isValid(path, c)) continue;     // pruning
//     path.push(c);                        // choose
//     backtrack(path, nextChoices(c), result);  // explore
//     path.pop();                          // UNCHOOSE (undo)
//   }
// }

// 🔸 Non-mutating alternative: pass a new array down.

// ⚠️ ALWAYS snapshot `[...path]` when pushing to results —
//    otherwise later mutations corrupt earlier entries.
// ⚠️ ALWAYS undo what you changed (push ↔ pop, mark ↔ unmark,
//    grid[r][c] = "#" ↔ restore).
// 🧠 Rule: "mutate before recurse, restore after recurse".

// ---------- Helper stubs (for the template to parse) ----------
function isGoal(_path: unknown[]): boolean { return false; }
function isValid(_path: unknown[], _c: unknown): boolean { return true; }
function nextChoices(_c: unknown): unknown[] { return []; }


/* ============================================================
 *  3️⃣ SUBSETS (POWER SET)
 * ============================================================ */
// 🔹 Every element is either IN or OUT.
// 🔸 Binary choice → 2^n subsets.
// 🎯 Foundation for subset-sum, partition, k-partition.

function subsets(xs: readonly number[]): number[][] {
  const result: number[][] = [];

  function backtrack(start: number, path: number[]): void {
    result.push([...path]);              // every prefix is a subset
    for (let i = start; i < xs.length; i++) {
      const v = xs[i];
      if (v === undefined) continue;
      path.push(v);
      backtrack(i + 1, path);            // i+1 = no reuse
      path.pop();
    }
  }

  backtrack(0, []);
  return result;
}

console.log(subsets([1, 2, 3]));
// [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]

// 🔸 Subsets WITHOUT duplicates (input may have dupes)
function subsetsWithDup(xs: readonly number[]): number[][] {
  const sorted = [...xs].sort((a, b) => a - b);
  const result: number[][] = [];

  function backtrack(start: number, path: number[]): void {
    result.push([...path]);
    for (let i = start; i < sorted.length; i++) {
      const v = sorted[i];
      const prev = sorted[i - 1];
      if (v === undefined) continue;
      if (i > start && v === prev) continue;    // skip duplicate branch
      path.push(v);
      backtrack(i + 1, path);
      path.pop();
    }
  }

  backtrack(0, []);
  return result;
}

console.log(subsetsWithDup([1, 2, 2]));
// [[], [1], [1,2], [1,2,2], [2], [2,2]]

// 🧠 Dedup trick: "if i > start and xs[i] === xs[i-1]: continue".
//    Used everywhere in backtracking with duplicates.


/* ============================================================
 *  4️⃣ PERMUTATIONS
 * ============================================================ */
// 🔹 Order matters; choose from remaining elements.
// 🔸 n! permutations.
// 🎯 Anagram groups, next-permutation, scheduling.

function permutations(xs: readonly number[]): number[][] {
  const result: number[][] = [];

  function backtrack(path: number[], used: boolean[]): void {
    if (path.length === xs.length) {
      result.push([...path]);
      return;
    }
    for (let i = 0; i < xs.length; i++) {
      if (used[i]) continue;
      const v = xs[i];
      if (v === undefined) continue;
      used[i] = true;
      path.push(v);
      backtrack(path, used);
      path.pop();
      used[i] = false;                   // UNDO
    }
  }

  backtrack([], new Array<boolean>(xs.length).fill(false));
  return result;
}

console.log(permutations([1, 2, 3]));
// [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]

// 🔸 Permutations with duplicates (input may have dupes)
function permutationsUnique(xs: readonly number[]): number[][] {
  const sorted = [...xs].sort((a, b) => a - b);
  const result: number[][] = [];
  const used = new Array<boolean>(sorted.length).fill(false);

  function backtrack(path: number[]): void {
    if (path.length === sorted.length) {
      result.push([...path]);
      return;
    }
    for (let i = 0; i < sorted.length; i++) {
      const v = sorted[i];
      if (v === undefined) continue;
      if (used[i]) continue;
      // Skip duplicate element at the same level
      const prev = sorted[i - 1];
      if (i > 0 && v === prev && !used[i - 1]) continue;
      used[i] = true;
      path.push(v);
      backtrack(path);
      path.pop();
      used[i] = false;
    }
  }

  backtrack([]);
  return result;
}

console.log(permutationsUnique([1, 1, 2]));
// [[1,1,2],[1,2,1],[2,1,1]]

// 🧠 `used` array tracks which elements are already in the path.
//    Dedup trick: skip duplicate at the same level if the
//    previous identical wasn't used yet.


/* ============================================================
 *  5️⃣ COMBINATIONS (N CHOOSE K)
 * ============================================================ */
// 🔹 Order does NOT matter; choose k from n.
// 🔸 C(n, k) results.
// 🎯 Lottery, grouping, k-sums.

function combinations(n: number, k: number): number[][] {
  const result: number[][] = [];

  function backtrack(start: number, path: number[]): void {
    if (path.length === k) {
      result.push([...path]);
      return;
    }
    const remaining = k - path.length;
    // Pruning: not enough numbers left
    for (let i = start; i <= n - remaining + 1; i++) {
      path.push(i);
      backtrack(i + 1, path);
      path.pop();
    }
  }

  backtrack(1, []);
  return result;
}

console.log(combinations(4, 2));
// [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]

// 🧠 The range bound `n - remaining + 1` prunes branches that
//    can't possibly reach k elements. Small change, big speedup.
//    Without it: still correct, but ~30% more work in tight cases.


/* ============================================================
 *  6️⃣ COMBINATION SUM (WITH PRUNING)
 * ============================================================ */
// 🔹 Find all combos that sum to target.
// 🔸 Variant 1: elements reusable (unbounded).
// 🔸 Variant 2: each element used once.

// 🔸 Unbounded: candidates may be reused
function combinationSumUnbounded(
  candidates: readonly number[],
  target: number,
): number[][] {
  const sorted = [...candidates].sort((a, b) => a - b);
  const result: number[][] = [];

  function backtrack(start: number, remaining: number, path: number[]): void {
    if (remaining === 0) {
      result.push([...path]);
      return;
    }
    for (let i = start; i < sorted.length; i++) {
      const c = sorted[i];
      if (c === undefined) continue;
      if (c > remaining) break;         // pruned: sorted!
      path.push(c);
      backtrack(i, remaining - c, path);    // i (reuse allowed)
      path.pop();
    }
  }

  backtrack(0, target, []);
  return result;
}

console.log(combinationSumUnbounded([2, 3, 6, 7], 7));
// [[2,2,3], [7]]

// 🔸 Each element used at most once
function combinationSumUnique(
  candidates: readonly number[],
  target: number,
): number[][] {
  const sorted = [...candidates].sort((a, b) => a - b);
  const result: number[][] = [];

  function backtrack(start: number, remaining: number, path: number[]): void {
    if (remaining === 0) {
      result.push([...path]);
      return;
    }
    for (let i = start; i < sorted.length; i++) {
      const c = sorted[i];
      const prev = sorted[i - 1];
      if (c === undefined) continue;
      if (i > start && c === prev) continue;   // dedup at same level
      if (c > remaining) break;                // prune
      path.push(c);
      backtrack(i + 1, remaining - c, path);   // i+1: no reuse
      path.pop();
    }
  }

  backtrack(0, target, []);
  return result;
}

console.log(combinationSumUnique([10, 1, 2, 7, 6, 1, 5], 8));
// [[1,1,6], [1,2,5], [1,7], [2,6]]

// 🧠 Pruning is EVERYTHING in combination sum:
//    - Sort first.
//    - If c > remaining → break (nothing bigger will fit).
//    - Dedup with the "i > start and same as previous" rule.


/* ============================================================
 *  7️⃣ PALINDROME PARTITIONING
 * ============================================================ */
// 🔹 Split a string into all possible palindrome substrings.
// 🔸 Backtracking over cut positions.

function palindromePartition(s: string): string[][] {
  const result: string[][] = [];

  function isPal(l: number, r: number): boolean {
    while (l < r) {
      if (s[l] !== s[r]) return false;
      l += 1;
      r -= 1;
    }
    return true;
  }

  function backtrack(start: number, path: string[]): void {
    if (start === s.length) {
      result.push([...path]);
      return;
    }
    for (let end = start; end < s.length; end++) {
      if (!isPal(start, end)) continue;         // prune
      path.push(s.slice(start, end + 1));
      backtrack(end + 1, path);
      path.pop();
    }
  }

  backtrack(0, []);
  return result;
}

console.log(palindromePartition("aab"));
// [["a","a","b"], ["aa","b"]]
console.log(palindromePartition("a"));
// [["a"]]

// 🧠 Nice example of pruning: skip non-palindrome prefixes so
//    the branching factor stays small.


/* ============================================================
 *  8️⃣ N-QUEENS (CLASSIC)
 * ============================================================ */
// 🔹 Place N queens on an N×N board so no two attack each other.
// 🔸 Backtrack row by row; track columns and both diagonals.
// 🎯 The canonical "hard" backtracking problem.

function solveNQueens(n: number): string[][] {
  const result: string[][] = [];
  const cols = new Set<number>();
  const diag1 = new Set<number>();       // r - c
  const diag2 = new Set<number>();       // r + c
  const board: string[][] = Array.from({ length: n }, () =>
    new Array<string>(n).fill("."),
  );

  function backtrack(row: number): void {
    if (row === n) {
      result.push(board.map((r) => r.join("")));
      return;
    }
    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) {
        continue;                        // attacked → prune
      }
      cols.add(col);
      diag1.add(row - col);
      diag2.add(row + col);
      const rowArr = board[row];
      if (rowArr) rowArr[col] = "Q";
      backtrack(row + 1);
      if (rowArr) rowArr[col] = ".";
      cols.delete(col);
      diag1.delete(row - col);
      diag2.delete(row + col);
    }
  }

  backtrack(0);
  return result;
}

const solutions = solveNQueens(4);
for (const sol of solutions) {
  for (const r of sol) console.log(r);
  console.log();
}
// .Q..
// ...Q
// Q...
// ..Q.
//
// ..Q.
// Q...
// ...Q
// .Q..

console.log(solveNQueens(8).length);      // 92

// 🧠 Diagonal hashing: r - c constant on ↘ diagonal; r + c
//    constant on ↙ diagonal. Set membership = O(1) check.
// 🔸 Pruning via O(1) attack checks is what makes N-Queens fast
//    up to N ≈ 15.


/* ============================================================
 *  9️⃣ SUDOKU SOLVER
 * ============================================================ */
// 🔹 Fill a 9×9 grid with 1–9, respecting row/col/box constraints.
// 🔸 Backtracking with validity check — finds one solution.

function solveSudoku(board: string[][]): boolean {
  function valid(r: number, c: number, ch: string): boolean {
    for (let i = 0; i < 9; i++) {
      if (board[r]?.[i] === ch) return false;   // row
      if (board[i]?.[c] === ch) return false;   // col
    }
    const br = 3 * Math.floor(r / 3);
    const bc = 3 * Math.floor(c / 3);
    for (let i = br; i < br + 3; i++) {
      for (let j = bc; j < bc + 3; j++) {
        if (board[i]?.[j] === ch) return false; // box
      }
    }
    return true;
  }

  function backtrack(): boolean {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r]?.[c] === ".") {
          for (let d = 1; d <= 9; d++) {
            const ch = String(d);
            if (valid(r, c, ch)) {
              const row = board[r];
              if (row) row[c] = ch;
              if (backtrack()) return true;
              if (row) row[c] = ".";
            }
          }
          return false;                  // no digit works
        }
      }
    }
    return true;                         // nothing empty
  }

  return backtrack();
}

const puzzle: string[][] = [
  ["5","3",".",".","7",".",".",".","."],
  ["6",".",".","1","9","5",".",".","."],
  [".","9","8",".",".",".",".","6","."],
  ["8",".",".",".","6",".",".",".","3"],
  ["4",".",".","8",".","3",".",".","1"],
  ["7",".",".",".","2",".",".",".","6"],
  [".","6",".",".",".",".","2","8","."],
  [".",".",".","4","1","9",".",".","5"],
  [".",".",".",".","8",".",".","7","9"],
];
solveSudoku(puzzle);
for (const row of puzzle) console.log(row.join(" "));
// 5 3 4 6 7 8 9 1 2
// 6 7 2 1 9 5 3 4 8
// 1 9 8 3 4 2 5 6 7
// 8 5 9 7 6 1 4 2 3
// 4 2 6 8 5 3 7 9 1
// 7 1 3 9 2 4 8 5 6
// 9 6 1 5 3 7 2 8 4
// 2 8 7 4 1 9 6 3 5
// 3 4 5 2 8 6 1 7 9

// 🧠 Optimisation: pick the cell with the FEWEST options
//    (MRV heuristic). Turns seconds into milliseconds for
//    hard puzzles.
// 🔸 Constraint propagation (box/row/col elimination) helps too.


/* ============================================================
 *  🔟 WORD SEARCH IN A GRID
 * ============================================================ */
// 🔹 Given a grid and a word, is the word formable by adjacent
//    (up/down/left/right) cells without reusing a cell?
// 🔸 Classic DFS + backtracking.

function wordSearch(board: string[][], word: string): boolean {
  const rows = board.length;
  const cols = board[0]?.length ?? 0;

  function dfs(r: number, c: number, i: number): boolean {
    if (i === word.length) return true;    // matched all letters
    if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
    const row = board[r];
    if (!row || row[c] !== word[i]) return false;
    const saved = row[c];
    if (saved === undefined) return false;
    row[c] = "#";                          // mark visited
    const found =
      dfs(r + 1, c, i + 1) ||
      dfs(r - 1, c, i + 1) ||
      dfs(r, c + 1, i + 1) ||
      dfs(r, c - 1, i + 1);
    row[c] = saved;                        // UNDO
    return found;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (dfs(r, c, 0)) return true;
    }
  }
  return false;
}

const grid = [
  ["A", "B", "C", "E"],
  ["S", "F", "C", "S"],
  ["A", "D", "E", "E"],
];
console.log(wordSearch(grid.map((r) => [...r]), "ABCCED"));  // true
console.log(wordSearch(grid.map((r) => [...r]), "SEE"));     // true
console.log(wordSearch(grid.map((r) => [...r]), "ABCB"));    // false

// 🧠 Snapshot the cell, mark "#", recurse, then RESTORE. That's
//    the backtracking undo in action.
// ⚠️ Don't forget the restore, or subsequent searches fail.
// ⚠️ Copy the grid if the caller still needs the original.


/* ============================================================
 *  1️⃣1️⃣ PATTERN RECOGNITION & PRUNING GUIDE
 * ============================================================ */
// 🔹 "Generate all ..."                → backtracking.
// 🔹 "All permutations / subsets"      → backtrack with used[].
// 🔹 "All combinations of size k"      → backtrack with start.
// 🔹 "Constraint satisfaction"         → backtrack + prune.
// 🔹 "Find one valid solution"         → DFS + early return true.
// 🔹 "Grid path search"                → DFS + mark/restore.
// 🔹 "Split into parts"                → backtrack on cut points.

// 🔸 Pruning checklist:
//    1. Sort input → break early when too big.
//    2. Skip duplicates: "i > start and xs[i] === xs[i-1]".
//    3. Bounds: stop when partial sum exceeds target.
//    4. Constraint checks (N-Queens, Sudoku): O(1) sets.
//    5. Ordering heuristic (MRV): pick most constrained first.
//    6. Memoise when subproblems overlap.

// ── Complexity reference ─────────────────────────────────────
// | Problem                 │ Output size  │ Notes             |
// |-------------------------|--------------|-------------------|
// | Subsets                 │ 2^n          │ O(n) per subset   |
// | Permutations            │ n!           │ used[] tracking   |
// | Combinations C(n,k)     │ C(n,k)       │ pruning helps     |
// | Combination sum         │ varies       │ sort + prune      |
// | Palindrome partition    │ O(2^n) worst │ palindrome check  |
// | N-Queens (N=8)          │ 92 solutions │ O(N!) worst       |
// | Sudoku                  │ 1 solution   │ backtrack + MRV   |
// | Word search             │ bool         │ DFS + undo        |
// ─────────────────────────────────────────────────────────────


/* ============================================================
 *  1️⃣2️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */
// ⚠️ Forgetting `path.pop()` → results contain wrong prefixes.
// ⚠️ Forgetting to push `[...path]` (copy) → all results are
//    the SAME (empty) array. Snapshot every time.
// ⚠️ Forgetting to reset `used[i] = false` → later paths skip
//    valid elements.
// ⚠️ Grid: forgetting to restore the cell → subsequent DFS
//    corrupted.
// ⚠️ Pruning with sort: if the array isn't sorted, `break` on
//    `c > remaining` is WRONG.
// ⚠️ Dedup: `i > start && xs[i] === xs[i-1]` only works when
//    the array is sorted.
// ⚠️ Empty input: subsets([]) returns [[]]; permutations([])
//    returns [[]]; combinations(n, 0) returns [[]].
// ⚠️ Deep recursion: backtracking hits V8's stack limit on
//    large inputs. Default ~10k frames is usually fine for
//    n ≤ ~15; use iterative for larger.
// ⚠️ Exponential blow-up: n=20 subsets = 1M; n=25 ≈ 33M. Too
//    big for JS in one pass. Recognise when the problem is not
//    meant to be brute-forced.
// ⚠️ `used` array vs Set — for indices, array[boolean] is faster.
// ⚠️ N-Queens diagonal hashes: r+c and r-c uniquely identify
//    diagonals.
// ⚠️ Sudoku: MRV heuristic (fewest options first) makes a huge
//    difference on hard puzzles.
// ⚠️ Word search: `saved = board[r][c]` before overwriting with
//    "#", then restore. Don't skip the restore.
// ⚠️ Result ordering matters for tests: match the problem's
//    expected order (lexicographic, input order, etc.).
// ⚠️ Memory: results array of arrays of size 2^n can exhaust
//    memory for large n. Consider a generator (yield).
// ⚠️ TypeScript: `[...path]` gives a shallow copy — for arrays
//    of objects, deep copy if the caller may mutate.

/* 🕒 Version notes
 * - Generators (yield) for backtracking: ES2015
 * - Array spread for snapshotting: ES2015
 * - Set / Map for O(1) constraint checks: ES2015
 * - Optional chaining (?.) / nullish coalescing (??): ES2020
 * - Object.hasOwn: ES2022
 * - structuredClone for deep-copying state: Node 17+ / modern browsers
 * - noUncheckedIndexedAccess: TS 4.1+
 * - BigInt for huge integers (rarely needed here): ES2020
 * - V8 stack limit ~10k frames — for deep backtracking,
 *   convert to iterative or increase stack via --stack-size flag
 *   (Node only, use with care)
 * - No built-in combinatorics library in JS — write your own
 *   or use a third-party lib (e.g., js-combinatorics)
 */


/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Problem               │ Path tracking       │ Prune trick    |
 * ─────────────────────────────────────────────────────────────
 * | Subsets               │ path list           │ start index    |
 * | Subsets (dup input)   │ path list           │ skip dup level |
 * | Permutations          │ used[] array        │ —              |
 * | Permutations (dup)    │ used[] array        │ skip if prev   |
 * |                       │                     │ not used       |
 * | Combinations          │ start index         │ range bound    |
 * | Combination sum       │ start + remaining   │ sort + break   |
 * | Palindrome partition  │ cut pointer         │ palindrome test|
 * | N-Queens              │ board + sets        │ O(1) attack    |
 * | Sudoku                │ board               │ MRV heuristic  |
 * | Word search           │ grid + mark         │ restore cell   |
 * ─────────────────────────────────────────────────────────────
 * | Step                  │ Meaning                             |
 * ─────────────────────────────────────────────────────────────
 * | choose                │ path.push(c) / board[r][c] = ch     |
 * | explore               │ backtrack (recurse)                 |
 * | unchoose (undo)       │ path.pop() / board[r][c] = saved    |
 * | prune                 │ `continue` on invalid / break on   |
 * |                       │ sorted bound                        |
 * | snapshot              │ result.push([...path])              |
 * ─────────────────────────────────────────────────────────────
 * | Pitfall                       │ Why it bites                 |
 * ─────────────────────────────────────────────────────────────
 * | path.pop() forgotten          │ Wrong results pushed         |
 * | [...path] copy forgotten      │ All results are the same arr |
 * | used[i] not reset             │ Wrong permutations           |
 * | grid not restored             │ Broken later searches        |
 * | Dedup without sorting         │ Duplicates still appear      |
 * | Break without sorted input    │ Miss valid combos            |
 * | Recursion depth too high      │ RangeError (stack)           |
 * | Expecting 2^n for n=30        │ Memory/time blowup           |
 * | Result order mismatch         │ Fails hidden tests           |
 * | `[T|undefined]` unchecked     │ TypeScript errors            |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Memorise the template: choose → explore → unchoose.
 *  - Always snapshot `[...path]` when pushing to results.
 *  - Always UNDO state before returning from a branch.
 *  - Sort input before dedup; use the "skip same at same level"
 *    rule.
 *  - Prune early: bounds check, remaining sum check, constraint
 *    sets.
 *  - For N-Queens and Sudoku, O(1) checks via sets are crucial.
 *  - For grid DFS, mark visited with a sentinel, restore after.
 *  - Recognise exponential problems — don't bruteforce n=25.
 *  - Watch the V8 stack limit; convert to iterative for very
 *    deep recursion, or write your own explicit-stack version.
 *  - Test: empty input, single element, duplicates, all-same,
 *    and no-solution cases.
 *  - Order results the way the problem expects (usually input
 *    order or lexicographic).
 *  - Narrow `T | undefined` from indexed access before use.
 * ============================================================ */