# 14_Tries.py

# ============================================================
#  📘 TRIES (PREFIX TREES) IN PYTHON — COMPLETE COVERAGE
#
#  A TRIE (pronounced "try", from re-TRIE-val) is a tree-like
#  data structure that stores strings character by character.
#  Each node represents a prefix; the path from root to a node
#  spells that prefix. Tries give O(L) lookup/insert where L is
#  the word length — INDEPENDENT of how many words are stored.
#
#  This file covers: node design, insert/search/startsWith, the
#  classic use cases (autocomplete, spell-check, word search,
#  longest common prefix), memory-efficient design (dict-based),
#  deletion, and the trade-offs vs hash sets.
#
#  Sections:
#   1. What a trie is
#   2. Node structure
#   3. Basic trie (insert, search, startsWith)
#   4. Deletion
#   5. Autocomplete (prefix suggestions)
#   6. Longest common prefix
#   7. Word search in a grid (with trie)
#   8. Compressed tries (Radix / Patricia) — preview
#   9. Trie vs hash set vs sorted list
#  10. Edge cases, pitfalls, version notes
# ============================================================


# ============================================================
#  1️⃣ WHAT A TRIE IS
# ============================================================
# 🔹 Each node = one character.
# 🔹 Path from root → node spells a prefix.
# 🔹 end-of-word flag marks a complete word.
# 🔸 Words sharing a prefix share the SAME nodes.
# 🎯 Use a trie when the problem says:
#     - "prefix"
#     - "search by prefix"
#     - "autocomplete"
#     - "dictionary of words, repeated lookups"
#
# ── Complexity ───────────────────────────────────────────────
# | Operation      │ Time    │ Notes                         |
# |----------------|---------|-------------------------------|
# | Insert         │ O(L)    │ L = word length               |
# | Search word    │ O(L)    │ independent of # words        |
# | Prefix search  │ O(L)    │ walk L nodes                  |
# | Delete word    │ O(L)    │ plus cleanup                  |
# | Space          │ O(N·L)  │ N words, average length L     |
# |                 │ (worst) │ less in practice due to share |
# ─────────────────────────────────────────────────────────────
#
# 🧠 Hash set is O(1) per lookup — but a trie wins when you
#    need PREFIX operations (autocomplete, longest common
#    prefix, wildcard search).


# ============================================================
#  2️⃣ NODE STRUCTURE
# ============================================================
# 🔹 Each node has:
#     - children: dict of char → child node
#     - is_word : True if a complete word ends here

class TrieNode:
    __slots__ = ("children", "is_word")

    def __init__(self) -> None:
        self.children: dict[str, "TrieNode"] = {}
        self.is_word: bool = False

    def __repr__(self) -> str:
        return f"TrieNode(words={self.is_word}, kids={list(self.children)})"

# 🧠 Using a dict (not array of 26) makes the trie work for any
#    alphabet — including Unicode. Slightly slower but flexible.


# ============================================================
#  3️⃣ BASIC TRIE (INSERT, SEARCH, STARTSWITH)
# ============================================================
# 🔹 insert: walk down, creating nodes as needed; mark end.
# 🔹 search: walk down; return True only if is_word at end.
# 🔹 startsWith: walk down; return True if path exists.

class Trie:
    def __init__(self) -> None:
        self.root = TrieNode()

    # ── Insert ───────────────────────────────────────────────
    def insert(self, word: str) -> None:
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_word = True

    # ── Search (whole word) ──────────────────────────────────
    def search(self, word: str) -> bool:
        node = self._find(word)
        return node is not None and node.is_word

    # ── startsWith (any word with this prefix) ───────────────
    def starts_with(self, prefix: str) -> bool:
        return self._find(prefix) is not None

    def _find(self, s: str) -> TrieNode | None:
        node = self.root
        for ch in s:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node

# Demo
t = Trie()
for w in ["apple", "app", "apricot", "banana", "band"]:
    t.insert(w)

print(t.search("app"))          # True
print(t.search("appl"))         # False — path exists but not a word
print(t.search("apple"))        # True
print(t.starts_with("app"))     # True
print(t.starts_with("apr"))     # True
print(t.starts_with("xyz"))     # False

# ⚠️ `search("app")` True only because we inserted "app" too.
#    If you insert only "apple", search("app") must return False
#    even though starts_with("app") is True.
t2 = Trie()
t2.insert("apple")
print(t2.search("app"))         # False  ← key distinction
print(t2.starts_with("app"))    # True

# 🧠 is_word flag = "does a word END here?" ≠ "does a path exist?"


# ============================================================
#  4️⃣ DELETION
# ============================================================
# 🔹 Two cases:
#     • If word is a prefix of another word → just clear is_word.
#     • If word shares no path with others → prune nodes.
# 🔸 Recursive postorder cleanup is cleanest.

def delete(trie: "Trie", word: str) -> bool:
    def _del(node: TrieNode, i: int) -> bool:
        if i == len(word):
            if not node.is_word:
                return False            # word not present
            node.is_word = False
            return len(node.children) == 0   # prune if leaf
        ch = word[i]
        child = node.children.get(ch)
        if child is None:
            return False
        should_delete_child = _del(child, i + 1)
        if should_delete_child:
            del node.children[ch]
            return not node.is_word and len(node.children) == 0
        return False
    return _del(trie.root, 0)

t = Trie()
for w in ["apple", "app", "applesauce"]:
    t.insert(w)

print(t.search("app"))          # True
delete(t, "app")
print(t.search("app"))          # False
print(t.search("apple"))        # True
print(t.search("applesauce"))   # True

# ⚠️ If you delete "apple" while "applesauce" exists, nodes for
#    "a-p-p-l-e" must NOT be pruned — "applesauce" still uses them.
# 🧠 The postorder cleanup handles this: only prune if no word
#    and no children remain.

# 🔸 Simpler alternative: just clear is_word, accept memory leak.
#    Fine for one-shot trie use.


# ============================================================
#  5️⃣ AUTOCOMPLETE (PREFIX SUGGESTIONS)
# ============================================================
# 🔹 1. Walk to the prefix node.
# 🔸 2. Collect all words in that subtree via DFS.
# 🎯 Classic typeahead / search-suggest feature.

def autocomplete(trie: "Trie", prefix: str) -> list[str]:
    node = trie._find(prefix)
    if node is None:
        return []
    out: list[str] = []
    def dfs(n: TrieNode, path: str) -> None:
        if n.is_word:
            out.append(path)
        for ch, child in n.children.items():
            dfs(child, path + ch)
    dfs(node, prefix)
    return out

t = Trie()
for w in ["car", "cart", "carbon", "care", "carpet", "dog", "do"]:
    t.insert(w)

print(autocomplete(t, "car"))       # ['car', 'care', 'carpet', 'cart', 'carbon']
print(autocomplete(t, "do"))        # ['do', 'dog']
print(autocomplete(t, "z"))         # []

# 🔸 Top-K suggestions: sort by word length, frequency, etc.
#    Real systems store a frequency counter on each word node.

# 🧠 Autocomplete = find prefix node + DFS subtree.


# ============================================================
#  6️⃣ LONGEST COMMON PREFIX
# ============================================================
# 🔹 Two approaches:
#     a) Compare pairwise (horizontal scan).
#     b) Insert all into a trie, walk until node has > 1 child
#        or is_word (means we left the shared path).
# 🎯 Trie version is elegant and O(total chars).

def longest_common_prefix(words: list[str]) -> str:
    if not words:
        return ""
    t = Trie()
    for w in words:
        t.insert(w)

    node = t.root
    prefix_chars: list[str] = []
    while len(node.children) == 1 and not node.is_word:
        ch, nxt = next(iter(node.children.items()))
        prefix_chars.append(ch)
        node = nxt
    return "".join(prefix_chars)

print(longest_common_prefix(["flower", "flow", "flight"]))  # "fl"
print(longest_common_prefix(["dog", "racecar", "car"]))     # ""
print(longest_common_prefix(["apple"]))                     # "apple"

# ⚠️ The `not node.is_word` check matters: if the shortest word
#    is a prefix of others (e.g., "app" + "apple"), we must stop
#    at "app".
print(longest_common_prefix(["app", "apple", "apples"]))    # "app"

# 🧠 Trie naturally answers "what prefix is shared by all?"


# ============================================================
#  7️⃣ WORD SEARCH IN A GRID (WITH TRIE)
# ============================================================
# 🔹 Classic: given a grid and a list of words, find all words
#    that can be formed by adjacent cells.
# 🔸 Brute force: DFS per word → O(words × R × C × 4^L).
# 🔸 Trie: build trie of words, single DFS over grid — prunes
#    branches that don't match any prefix. Huge speedup.

def find_words(grid: list[list[str]], words: list[str]) -> list[str]:
    t = Trie()
    for w in words:
        t.insert(w)

    rows, cols = len(grid), len(grid[0])
    found: set[str] = set()

    def dfs(r: int, c: int, node: TrieNode, path: str) -> None:
        if not (0 <= r < rows and 0 <= c < cols):
            return
        ch = grid[r][c]
        if ch == "#":                        # visited marker
            return
        nxt = node.children.get(ch)
        if nxt is None:
            return
        path += ch
        if nxt.is_word:
            found.add(path)
        grid[r][c] = "#"                     # mark visited
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            dfs(r + dr, c + dc, nxt, path)
        grid[r][c] = ch                      # restore

    for r in range(rows):
        for c in range(cols):
            dfs(r, c, t.root, "")
    return sorted(found)

grid = [
    ["o", "a", "a", "n"],
    ["e", "t", "a", "e"],
    ["i", "h", "k", "r"],
    ["i", "f", "l", "v"],
]
words = ["oath", "pea", "eat", "rain"]
print(find_words(grid, words))      # ['eat', 'oath']

# 🧠 Trie turns "search each word separately" into "one DFS that
#    prunes early". This is THE interview classic for tries.

# ⚠️ After a word is found, you can OPTIONALLY mark its trie
#    node is_word = False to avoid duplicate work.
# ⚠️ Restore the grid after DFS (backtracking).
# ⚠️ The "#" sentinel works when "#" is guaranteed absent from
#    input. Otherwise use a separate visited set.


# ============================================================
#  8️⃣ COMPRESSED TRIES (RADIX / PATRICIA) — PREVIEW
# ============================================================
# 🔹 A compressed trie merges chains of single-child nodes into
#    edges labelled with strings.
# 🔸 Saves memory and speeds up lookups for long unique strings.
# 🎯 Used in IP routing tables, patricia tries, and Redis.

# Conceptual node — not the classic char-per-node trie:
class RadixNode:
    __slots__ = ("label", "children", "is_word")
    def __init__(self, label: str = "") -> None:
        self.label = label                  # edge label (a string)
        self.children: dict[str, "RadixNode"] = {}
        self.is_word = False

# 🔸 Real implementations split edges during insert.
# 🔸 For DSA interviews, the char-per-node trie (above) is
#    usually the expected answer.

# 🧠 Compressed tries are an optimisation; understand the
#    classic trie first.


# ============================================================
#  9️⃣ TRIE VS HASH SET VS SORTED LIST
# ============================================================
# ── Comparison ───────────────────────────────────────────────
# | Feature                 │ Trie    │ Hash Set  │ Sorted List  |
# |-------------------------|---------|-----------|--------------|
# | Exact word lookup       │ O(L)    │ O(L) hash │ O(L log n)   |
# | Prefix search           │ O(L)    │ O(n·L)    │ O(log n + k) |
# | Autocomplete            │ O(L+k)  │ O(n·L)    │ O(log n + k) |
# | Memory                  │ High    │ Low       │ Low          |
# | Ordered iteration       │ DFS     │ None      │ Sorted       |
# | Wildcard patterns       │ ✅      │ ❌        │ ❌           |
# ─────────────────────────────────────────────────────────────
#
# 🧠 Pick a trie when:
#    - You need fast PREFIX operations.
#    - You insert/search MANY times.
#    - You need wildcard / pattern search.
#    Otherwise a set or sorted list is simpler.

# 🔸 Wildcard search ("c.t", "c*") is a natural trie operation:
def search_wildcard(trie: "Trie", pattern: str) -> list[str]:
    out: list[str] = []
    def dfs(node: TrieNode, i: int, path: str) -> None:
        if i == len(pattern):
            if node.is_word:
                out.append(path)
            return
        ch = pattern[i]
        if ch == ".":                        # matches any one char
            for c, child in node.children.items():
                dfs(child, i + 1, path + c)
        else:
            child = node.children.get(ch)
            if child is not None:
                dfs(child, i + 1, path + ch)
    dfs(trie.root, 0, "")
    return out

t = Trie()
for w in ["cat", "car", "cart", "cut", "dog"]:
    t.insert(w)
print(search_wildcard(t, "ca."))     # ['car', 'cat']
print(search_wildcard(t, "ca.."))    # ['cart']
print(search_wildcard(t, ".og"))     # ['dog']


# ============================================================
#  🔟 EDGE CASES, PITFALLS, VERSION NOTES
# ============================================================
# ⚠️ is_word vs path-exists — the #1 confusion.
#    search("app") != starts_with("app") unless "app" was
#    inserted as a complete word.
# ⚠️ Deleting a word: do NOT prune nodes still used by longer
#    words. Post-order cleanup handles this.
# ⚠️ Deleting: if word not present, return False without
#    mutating the trie.
# ⚠️ Memory: char-per-node tries are heavy. For very large
#    dictionaries, use compressed tries (Radix / Patricia).
# ⚠️ Empty string "" — is it a valid word? If yes, root.is_word
#    must be set. Usually empty string is disallowed.
# ⚠️ Unicode / non-ASCII: dict-based children handle it, but
#    array-of-26 does NOT.
# ⚠️ Case sensitivity: normalise (lowercase) before insert and
#    search if the problem expects case-insensitive behaviour.
# ⚠️ Autocomplete: DFS collects in ALPHABETICAL order if
#    children is a dict and you sort keys — dict order is
#    insertion order, not sorted.
# ⚠️ In grid word search, mark visited on the grid carefully —
#    restore after DFS for backtracking.
# ⚠️ Recursion in DFS over trie: bounded by word length, safe
#    unless words are enormous.
# ⚠️ Thread safety: mutable trie is not thread-safe. Use a lock
#    or a copy if needed.

# 🕒 Version notes
# - `__slots__` on TrieNode: Python 3.0+
# - PEP 604 unions (TrieNode | None): Python 3.10+
#   For 3.9 and below, use Optional[TrieNode]
# - dict preserves insertion order: Python 3.7+
# - `next(iter(d))` to grab a dict item: always available
# - no built-in trie in stdlib; roll your own or use pygtrie /
#   marisa-trie (third-party)
# - `dataclass`-based TrieNode works but is slower than
#   __slots__ for large tries


# ============================================================
#  📌 RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Operation                │ Time    │ Notes                   |
# ─────────────────────────────────────────────────────────────
# | insert(word)             │ O(L)    │ L = len(word)           |
# | search(word)             │ O(L)    │ must end with is_word   |
# | startsWith(prefix)       │ O(L)    │ path exists             |
# | delete(word)             │ O(L)    │ + prune unused nodes    |
# | autocomplete(prefix)     │ O(L+k)  │ k = #matches            |
# | wildcard search(pattern) │ O(L·b)  │ b = branching           |
# ─────────────────────────────────────────────────────────────
# | Node fields         │ Purpose                              |
# ─────────────────────────────────────────────────────────────
# | children: dict      │ char → child node                    |
# | is_word: bool       │ True if a complete word ends here    |
# ─────────────────────────────────────────────────────────────
# | Classic problem          │ Trie trick                      |
# ─────────────────────────────────────────────────────────────
# | Autocomplete             │ find prefix + DFS subtree       |
# | Longest common prefix    │ walk while 1 child, not is_word |
# | Word search in grid      │ trie + grid DFS                 |
# | Spell check              │ search(word)                    |
# | Word break               │ DFS + memo + trie               |
# | Wildcard search          │ DFS with "." = any child        |
# | Top-K suggestions        │ node.freq counter + heap        |
# ─────────────────────────────────────────────────────────────
# | Pitfall                    │ Why it bites                   |
# ─────────────────────────────────────────────────────────────
# | search vs startsWith       │ is_word flag semantics         |
# | Pruning on delete          │ Breaks longer words            |
# | Root is_word not set       │ Empty-string handling          |
# | 26-array on non-ASCII      │ Unicode breaks                 |
# | DFS order not alphabetical │ children is dict, not sorted   |
# | Grid DFS without restore   │ Infinite loops                 |
# | Mutating trie during DFS   │ Race / wrong results           |
# | Recursion on very long word│ RecursionError                 |
# ─────────────────────────────────────────────────────────────
#
# 🧠 BEST PRACTICES
#  - Use dict-based children (not 26-array) for any alphabet.
#  - is_word ≠ "path exists" — document clearly.
#  - Always insert BOTH "app" and "apple" if you want
#    search("app") = True.
#  - Delete: post-order cleanup — prune only if no word AND
#    no children.
#  - For long chains of unique words, consider compressed tries.
#  - Case-insensitive → lowercase before insert/search.
#  - Grid word search: trie + DFS + backtracking = the
#    canonical solution.
#  - Use a set for exact-only lookups — much less memory.
#  - For top-k autocomplete, store frequency and pop from a heap.
#  - Test with: empty string, single char, duplicate prefixes,
#    word that is prefix of another, deletion of shared prefix.
# ============================================================