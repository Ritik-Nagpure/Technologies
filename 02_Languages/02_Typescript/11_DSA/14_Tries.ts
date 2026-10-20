// 14_Tries.ts

/* ============================================================
 *  📘 TRIES (PREFIX TREES) IN TYPESCRIPT — COMPLETE COVERAGE
 *
 *  A TRIE (pronounced "try", from re-TRIE-val) is a tree-like
 *  data structure that stores strings character by character.
 *  Each node represents a prefix; the path from root to a node
 *  spells that prefix. Tries give O(L) lookup/insert where L is
 *  the word length — INDEPENDENT of how many words are stored.
 *
 *  This file covers: node design, insert/search/startsWith, the
 *  classic use cases (autocomplete, spell-check, word search,
 *  longest common prefix), memory-efficient design, deletion,
 *  and the trade-offs vs hash sets.
 *
 *  Sections:
 *   1. What a trie is
 *   2. Node structure
 *   3. Basic trie (insert, search, startsWith)
 *   4. Deletion
 *   5. Autocomplete (prefix suggestions)
 *   6. Longest common prefix
 *   7. Word search in a grid (with trie)
 *   8. Compressed tries (Radix / Patricia) — preview
 *   9. Trie vs Set vs sorted array
 *  10. Edge cases, pitfalls, version notes
 * ============================================================ */


/* ============================================================
 *  1️⃣ WHAT A TRIE IS
 * ============================================================ */
// 🔹 Each node = one character.
// 🔹 Path from root → node spells a prefix.
// 🔹 end-of-word flag marks a complete word.
// 🔸 Words sharing a prefix share the SAME nodes.
// 🎯 Use a trie when the problem says:
//     - "prefix"
//     - "search by prefix"
//     - "autocomplete"
//     - "dictionary of words, repeated lookups"
//
// ── Complexity ───────────────────────────────────────────────
// | Operation      │ Time    │ Notes                         |
// |----------------|---------|-------------------------------|
// | Insert         │ O(L)    │ L = word length               |
// | Search word    │ O(L)    │ independent of # words        |
// | Prefix search  │ O(L)    │ walk L nodes                  |
// | Delete word    │ O(L)    │ plus cleanup                  |
// | Space          │ O(N·L)  │ N words, average length L     |
// |                 │ (worst) │ less in practice due to share |
// ─────────────────────────────────────────────────────────────
//
// 🧠 Set is O(1) per lookup — but a trie wins when you need
//    PREFIX operations (autocomplete, longest common prefix,
//    wildcard search).


/* ============================================================
 *  2️⃣ NODE STRUCTURE
 * ============================================================ */
// 🔹 Each node has:
//     - children: Map<char, TrieNode>
//     - isWord  : true if a complete word ends here

class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isWord = false;

  toString(): string {
    return `TrieNode(words=${this.isWord}, kids=[${[...this.children.keys()].join(",")}])`;
  }
}

// 🧠 Using a Map (not an array of 26) makes the trie work for any
//    alphabet — including Unicode. Slightly slower but flexible.
// 🔸 For pure lowercase a-z, an array of 26 nodes would be faster
//    but less general.


/* ============================================================
 *  3️⃣ BASIC TRIE (INSERT, SEARCH, STARTSWITH)
 * ============================================================ */
// 🔹 insert: walk down, creating nodes as needed; mark end.
// 🔹 search: walk down; return true only if isWord at end.
// 🔹 startsWith: walk down; return true if path exists.

class Trie {
  root: TrieNode = new TrieNode();

  insert(word: string): void {
    let node = this.root;
    for (const ch of word) {
      let next = node.children.get(ch);
      if (!next) {
        next = new TrieNode();
        node.children.set(ch, next);
      }
      node = next;
    }
    node.isWord = true;
  }

  search(word: string): boolean {
    const node = this.find(word);
    return node !== null && node.isWord;
  }

  startsWith(prefix: string): boolean {
    return this.find(prefix) !== null;
  }

  private find(s: string): TrieNode | null {
    let node: TrieNode = this.root;
    for (const ch of s) {
      const next = node.children.get(ch);
      if (!next) return null;
      node = next;
    }
    return node;
  }
}

// Demo
const t = new Trie();
for (const w of ["apple", "app", "apricot", "banana", "band"]) t.insert(w);

console.log(t.search("app"));           // true
console.log(t.search("appl"));          // false — path exists but not a word
console.log(t.search("apple"));         // true
console.log(t.startsWith("app"));       // true
console.log(t.startsWith("apr"));       // true
console.log(t.startsWith("xyz"));       // false

// ⚠️ `search("app")` is true only because we inserted "app" too.
//    If you insert only "apple", search("app") must return false
//    even though startsWith("app") is true.
const t2 = new Trie();
t2.insert("apple");
console.log(t2.search("app"));          // false ← key distinction
console.log(t2.startsWith("app"));      // true

// 🧠 isWord flag = "does a word END here?" ≠ "does a path exist?"


/* ============================================================
 *  4️⃣ DELETION
 * ============================================================ */
// 🔹 Two cases:
//     • If word is a prefix of another word → just clear isWord.
//     • If word shares no path with others → prune nodes.
// 🔸 Recursive postorder cleanup is cleanest.

function deleteWord(trie: Trie, word: string): boolean {
  function del(node: TrieNode, i: number): boolean {
    if (i === word.length) {
      if (!node.isWord) return false;    // word not present
      node.isWord = false;
      return node.children.size === 0;   // prune if leaf
    }
    const ch = word[i];
    if (ch === undefined) return false;
    const child = node.children.get(ch);
    if (!child) return false;
    const shouldDelete = del(child, i + 1);
    if (shouldDelete) {
      node.children.delete(ch);
      return !node.isWord && node.children.size === 0;
    }
    return false;
  }
  return del(trie.root, 0);
}

const t3 = new Trie();
for (const w of ["apple", "app", "applesauce"]) t3.insert(w);

console.log(t3.search("app"));          // true
deleteWord(t3, "app");
console.log(t3.search("app"));          // false
console.log(t3.search("apple"));        // true
console.log(t3.search("applesauce"));   // true

// ⚠️ If you delete "apple" while "applesauce" exists, nodes for
//    "a-p-p-l-e" must NOT be pruned — "applesauce" still uses them.
// 🧠 The postorder cleanup handles this: only prune if no word
//    and no children remain.
// 🔸 Simpler alternative: just clear isWord, accept memory leak.
//    Fine for one-shot trie use.


/* ============================================================
 *  5️⃣ AUTOCOMPLETE (PREFIX SUGGESTIONS)
 * ============================================================ */
// 🔹 1. Walk to the prefix node.
// 🔸 2. Collect all words in that subtree via DFS.
// 🎯 Classic typeahead / search-suggest feature.

function autocomplete(trie: Trie, prefix: string, limit: number = Infinity): string[] {
  // Walk to prefix node
  let node: TrieNode = trie.root;
  for (const ch of prefix) {
    const next = node.children.get(ch);
    if (!next) return [];
    node = next;
  }

  const out: string[] = [];
  function dfs(n: TrieNode, path: string): void {
    if (out.length >= limit) return;
    if (n.isWord) out.push(path);
    for (const [ch, child] of n.children) {
      dfs(child, path + ch);
      if (out.length >= limit) return;
    }
  }
  dfs(node, prefix);
  return out;
}

const t4 = new Trie();
for (const w of ["car", "cart", "carbon", "care", "carpet", "dog", "do"]) {
  t4.insert(w);
}

console.log(autocomplete(t4, "car"));
// ["car", "care", "carpet", "cart", "carbon"]

console.log(autocomplete(t4, "do"));    // ["do", "dog"]
console.log(autocomplete(t4, "z"));     // []

// 🔸 Top-K suggestions: sort by frequency, or store a frequency
//    counter on each word node.
// 🧠 Autocomplete = find prefix node + DFS subtree.

// 🔸 Sorted output (if the problem demands lexicographic order):
function autocompleteSorted(trie: Trie, prefix: string, limit?: number): string[] {
  return autocomplete(trie, prefix, limit).sort();
}


/* ============================================================
 *  6️⃣ LONGEST COMMON PREFIX
 * ============================================================ */
// 🔹 Two approaches:
//     a) Compare pairwise (horizontal scan).
//     b) Insert all into a trie, walk until node has > 1 child
//        or isWord (means we left the shared path).
// 🎯 Trie version is elegant and O(total chars).

function longestCommonPrefix(words: readonly string[]): string {
  if (words.length === 0) return "";
  const trie = new Trie();
  for (const w of words) trie.insert(w);

  let node: TrieNode = trie.root;
  const prefix: string[] = [];
  while (node.children.size === 1 && !node.isWord) {
    const [ch, next] = [...node.children.entries()][0]!;
    prefix.push(ch);
    node = next;
  }
  return prefix.join("");
}

console.log(longestCommonPrefix(["flower", "flow", "flight"]));   // "fl"
console.log(longestCommonPrefix(["dog", "racecar", "car"]));      // ""
console.log(longestCommonPrefix(["apple"]));                       // "apple"

// ⚠️ The `!node.isWord` check matters: if the shortest word is a
//    prefix of others (e.g., "app" + "apple"), we must stop at
//    "app".
console.log(longestCommonPrefix(["app", "apple", "apples"]));      // "app"

// 🧠 Trie naturally answers "what prefix is shared by all?"


/* ============================================================
 *  7️⃣ WORD SEARCH IN A GRID (WITH TRIE)
 * ============================================================ */
// 🔹 Classic: given a grid and a list of words, find all words
//    that can be formed by adjacent cells.
// 🔸 Brute force: DFS per word → O(words × R × C × 4^L).
// 🔸 Trie: build trie of words, single DFS over grid — prunes
//    branches that don't match any prefix. Huge speedup.

function findWords(grid: string[][], words: readonly string[]): string[] {
  const trie = new Trie();
  for (const w of words) trie.insert(w);

  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const found = new Set<string>();

  function dfs(r: number, c: number, node: TrieNode, path: string): void {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    const row = grid[r];
    if (!row) return;
    const ch = row[c];
    if (ch === undefined || ch === "#") return;
    const next = node.children.get(ch);
    if (!next) return;
    const newPath = path + ch;
    if (next.isWord) found.add(newPath);
    row[c] = "#";                        // mark visited
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as Array<[number, number]>) {
      dfs(r + dr, c + dc, next, newPath);
    }
    row[c] = ch;                         // restore
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dfs(r, c, trie.root, "");
    }
  }
  return [...found].sort();
}

const grid = [
  ["o", "a", "a", "n"],
  ["e", "t", "a", "e"],
  ["i", "h", "k", "r"],
  ["i", "f", "l", "v"],
];
const words = ["oath", "pea", "eat", "rain"];
console.log(findWords(grid.map((r) => [...r]), words));
// ["eat", "oath"]

// 🧠 Trie turns "search each word separately" into "one DFS that
//    prunes early". This is THE interview classic for tries.
// ⚠️ After a word is found, you can OPTIONALLY mark its trie
//    node isWord = false to avoid duplicate work.
// ⚠️ Restore the grid after DFS (backtracking).
// ⚠️ The "#" sentinel works when "#" is guaranteed absent from
//    input. Otherwise use a separate visited set.


/* ============================================================
 *  8️⃣ COMPRESSED TRIES (RADIX / PATRICIA) — PREVIEW
 * ============================================================ */
// 🔹 A compressed trie merges chains of single-child nodes into
//    edges labelled with strings.
// 🔸 Saves memory and speeds up lookups for long unique strings.
// 🎯 Used in IP routing tables, patricia tries, and Redis.

class RadixNode {
  label: string;
  children: Map<string, RadixNode> = new Map();
  isWord = false;

  constructor(label: string = "") {
    this.label = label;
  }
}

// 🔸 Real implementations split edges during insert.
// 🔸 For DSA interviews, the char-per-node trie (above) is
//    usually the expected answer.

// 🧠 Compressed tries are an optimisation; understand the
//    classic trie first.


/* ============================================================
 *  9️⃣ TRIE VS SET VS SORTED ARRAY
 * ============================================================ */
// ── Comparison ───────────────────────────────────────────────
// | Feature                 │ Trie    │ Set       │ Sorted Array |
// |-------------------------|---------|-----------|--------------|
// | Exact word lookup       │ O(L)    │ O(L) hash │ O(L log n)   |
// | Prefix search           │ O(L)    │ O(n·L)    │ O(log n + k) |
// | Autocomplete            │ O(L+k)  │ O(n·L)    │ O(log n + k) |
// | Memory                  │ High    │ Low       │ Low          |
// | Ordered iteration       │ DFS     │ None      │ Sorted       |
// | Wildcard patterns       │ ✅      │ ❌        │ ❌           |
// ─────────────────────────────────────────────────────────────
//
// 🧠 Pick a trie when:
//    - You need fast PREFIX operations.
//    - You insert/search MANY times.
//    - You need wildcard / pattern search.
//    Otherwise a Set or sorted array is simpler.

// 🔸 Wildcard search ("c.t", "c*") is a natural trie operation:
function searchWildcard(trie: Trie, pattern: string): string[] {
  const out: string[] = [];
  function dfs(node: TrieNode, i: number, path: string): void {
    if (i === pattern.length) {
      if (node.isWord) out.push(path);
      return;
    }
    const ch = pattern[i];
    if (ch === undefined) return;
    if (ch === ".") {
      // matches any one char
      for (const [c, child] of node.children) {
        dfs(child, i + 1, path + c);
      }
    } else {
      const child = node.children.get(ch);
      if (child) dfs(child, i + 1, path + ch);
    }
  }
  dfs(trie.root, 0, "");
  return out;
}

const tw = new Trie();
for (const w of ["cat", "car", "cart", "cut", "dog"]) tw.insert(w);
console.log(searchWildcard(tw, "ca."));     // ["car", "cat"]
console.log(searchWildcard(tw, "ca.."));    // ["cart"]
console.log(searchWildcard(tw, ".og"));     // ["dog"]


/* ============================================================
 *  🔟 EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */
// ⚠️ isWord vs path-exists — the #1 confusion.
//    search("app") != startsWith("app") unless "app" was
//    inserted as a complete word.
// ⚠️ Deleting a word: do NOT prune nodes still used by longer
//    words. Post-order cleanup handles this.
// ⚠️ Deleting: if word not present, return false without
//    mutating the trie.
// ⚠️ Memory: char-per-node tries are heavy. For very large
//    dictionaries, use compressed tries (Radix / Patricia).
// ⚠️ Empty string "" — is it a valid word? If yes, root.isWord
//    must be set. Usually empty string is disallowed.
// ⚠️ Unicode / non-ASCII: Map-based children handle it, but
//    array-of-26 does NOT.
// ⚠️ Case sensitivity: normalise (lowercase) before insert and
//    search if the problem expects case-insensitive behaviour.
// ⚠️ Autocomplete: DFS order depends on Map insertion order.
//    Sort the keys for deterministic alphabetical output.
// ⚠️ In grid word search, mark visited on the grid carefully —
//    restore after DFS for backtracking.
// ⚠️ Recursion in DFS over trie: bounded by word length, safe
//    unless words are enormous.
// ⚠️ Thread safety: mutable trie is not thread-safe. Use a lock
//    or copy if needed.
// ⚠️ TypeScript: Map iteration order is insertion order — good
//    for deterministic output if you insert deterministically.
// ⚠️ Do not use a plain object as children map — hidden-class
//    penalties with dynamic keys. Map is idiomatic.

/* 🕒 Version notes
 * - Map / Set: ES2015
 * - for...of over Map entries: ES2015
 * - Generator functions for trie iterators: ES2015
 * - Optional chaining / nullish coalescing: ES2020
 * - Object.hasOwn: ES2022
 * - structuredClone: Node 17+ (deep clone a trie, if needed)
 * - TypeScript strict + noUncheckedIndexedAccess: TS 4.1+
 * - No built-in trie in JS / TS stdlib
 * - Third-party: `trie-search`, `mnemonist`'s Trie
 * - For huge dictionaries, consider WASM or C++ bindings
 */


/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Operation                │ Time    │ Notes                   |
 * ─────────────────────────────────────────────────────────────
 * | insert(word)             │ O(L)    │ L = len(word)           |
 * | search(word)             │ O(L)    │ must end with isWord    |
 * | startsWith(prefix)       │ O(L)    │ path exists             |
 * | delete(word)             │ O(L)    │ + prune unused nodes    |
 * | autocomplete(prefix)     │ O(L+k)  │ k = #matches            |
 * | wildcard search(pattern) │ O(L·b)  │ b = branching           |
 * ─────────────────────────────────────────────────────────────
 * | Node fields         │ Purpose                              |
 * ─────────────────────────────────────────────────────────────
 * | children: Map       │ char → child node                    |
 * | isWord: boolean     │ true if a word ends here             |
 * ─────────────────────────────────────────────────────────────
 * | Classic problem          │ Trie trick                      |
 * ─────────────────────────────────────────────────────────────
 * | Autocomplete             │ find prefix + DFS subtree       |
 * | Longest common prefix    │ walk while 1 child, not isWord  |
 * | Word search in grid      │ trie + grid DFS                 |
 * | Spell check              │ search(word)                    |
 * | Word break               │ DFS + memo + trie               |
 * | Wildcard search          │ DFS with "." = any child        |
 * | Top-K suggestions        │ node.freq counter + heap        |
 * ─────────────────────────────────────────────────────────────
 * | Pitfall                    │ Why it bites                   |
 * ─────────────────────────────────────────────────────────────
 * | search vs startsWith       │ isWord flag semantics         |
 * | Pruning on delete          │ Breaks longer words            |
 * | Root isWord not set        │ Empty-string handling          |
 * | 26-array on non-ASCII      │ Unicode breaks                 |
 * | DFS order not alphabetical │ Map is insertion order         |
 * | Grid DFS without restore   │ Infinite loops                 |
 * | Mutating trie during DFS   │ Race / wrong results           |
 * | Recursion on very long word│ RangeError (stack)             |
 * | Object instead of Map      │ Hidden-class deopt             |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Use Map-based children (not 26-array) for any alphabet.
 *  - isWord ≠ "path exists" — document clearly.
 *  - Always insert BOTH "app" and "apple" if you want
 *    search("app") = true.
 *  - Delete: post-order cleanup — prune only if no word AND
 *    no children.
 *  - For long chains of unique words, consider compressed tries.
 *  - Case-insensitive → lowercase before insert/search.
 *  - Grid word search: trie + DFS + backtracking = the
 *    canonical solution.
 *  - Use a Set for exact-only lookups — much less memory.
 *  - For top-k autocomplete, store frequency and pop from a heap.
 *  - Test with: empty string, single char, duplicate prefixes,
 *    word that is prefix of another, deletion of shared prefix.
 *  - Sort autocomplete output when the problem needs
 *    alphabetical order.
 *  - Convert trie to array of entries for JSON serialisation.
 * ============================================================ */