# 04_Hashing_Dicts_and_Sets.py

# ============================================================
#  📘 HASHING, DICTS & SETS IN PYTHON — COMPLETE COVERAGE
#
#  A hash table maps keys to values via a HASH FUNCTION that
#  turns arbitrary keys into array indices. Python's dict and
#  set are both hash tables, giving amortised O(1) lookup,
#  insert, and delete — the single most important data-structure
#  trick in interview problems.
#
#  This file covers: what hashing is, why dict/set are fast,
#  hashable requirements, dict and set operations, Counter,
#  defaultdict, OrderedDict, dict comprehensions, collision
#  theory, and the classic interview patterns (frequency maps,
#  two-sum, dedup, grouping).
#
#  Sections:
#   1. Why hashing matters
#   2. What a hash table actually is
#   3. Hashable vs unhashable
#   4. Dict — operations and complexity
#   5. Set — operations and complexity
#   6. Dict/set comprehensions
#   7. Counter, defaultdict, OrderedDict
#   8. Common DSA patterns (frequency, two-sum, grouping)
#   9. Collisions and worst-case behaviour
#  10. Edge cases, pitfalls, version notes
# ============================================================


# ============================================================
#  1️⃣ WHY HASHING MATTERS
# ============================================================
# 🔹 `x in list` is O(n) — slow for repeated lookups.
# 🔹 `x in set` / `x in dict` is O(1) average — near-instant.
# 🎯 Hashing converts O(n) problems into O(n) TOTAL (from O(n²))
#    by trading a bit of memory for speed.

# ❌ O(n²): nested loop membership
def has_duplicates_slow(xs: list[int]) -> bool:
    for i in range(len(xs)):
        for j in range(i + 1, len(xs)):
            if xs[i] == xs[j]:
                return True
    return False

# ✅ O(n): one pass with a set
def has_duplicates_fast(xs: list[int]) -> bool:
    seen: set[int] = set()
    for x in xs:
        if x in seen:
            return True
        seen.add(x)
    return False

# 🧠 Rule: whenever you write `x in collection` inside a loop,
#    ask if a set / dict would be O(1) instead of O(n).


# ============================================================
#  2️⃣ WHAT A HASH TABLE ACTUALLY IS
# ============================================================
# 🔹 A hash table is an array of "buckets".
# 🔸 Insert: hash(key) % size → bucket index → store (key, value).
# 🔸 Lookup: hash(key) % size → bucket → compare keys.
# 🔸 On collision (two keys land in the same bucket), Python uses
#    OPEN ADDRESSING (probing) — not chaining.
# 🎯 Average O(1) because loads are kept < 2/3 of capacity.

# 🔎 hash() is a built-in:
print(hash(42))                         # 42
print(hash("hello"))                    # varies per run (salted)
print(hash((1, 2)))                     # hash of tuple

# ⚠️ hash() of strings is RANDOMISED per process (PYTHONHASHSEED)
#    for security. That's why dict ordering is by insertion, not
#    by hash value.

# 🧠 Two keys are considered "the same" only if:
#      a == b  AND  hash(a) == hash(b)
#    If your class defines __eq__ but not __hash__, it becomes
#    unhashable (see 06_OOP for details).


# ============================================================
#  3️⃣ HASHABLE VS UNHASHABLE
# ============================================================
# 🔹 Hashable    : int, str, tuple (of hashables), frozenset, None,
#                  user classes with __hash__ + __eq__.
# 🔸 Unhashable  : list, dict, set, bytearray, and any mutable
#                  container.

print(hash(1), hash("a"), hash((1, 2)))
# hash([1, 2])                          # ❌ TypeError: unhashable type: 'list'
# hash({1: 2})                          # ❌ TypeError: unhashable type: 'dict'

# ✅ Convert unhashable → hashable
print(hash(tuple([1, 2, 3])))           # tuple is hashable
print(hash(frozenset({1, 2, 3})))       # frozenset is hashable

# 🧠 Need a list as a dict key? Store it as tuple(...) or
#    frozenset(...). This comes up in graph and DP problems.


# ============================================================
#  4️⃣ DICT — OPERATIONS AND COMPLEXITY
# ============================================================
# 🔹 dict is the single most important DSA structure in Python.

d: dict[str, int] = {"a": 1, "b": 2}

# Read
d["a"]                                  # O(1) average → 1
d.get("c", 0)                           # O(1) with default → 0
d.get("a")                              # → 1

# Write
d["c"] = 3                              # O(1) average
d.setdefault("d", 4)                    # O(1) — inserts only if missing
print(d)                                # {'a': 1, 'b': 2, 'c': 3, 'd': 4}

# Delete
del d["c"]                              # O(1)
val = d.pop("d", None)                  # O(1) with default
d.popitem()                             # O(1) — removes last inserted

# Membership & iteration
print("a" in d)                         # O(1)
print(list(d.keys()))                   # O(n)
print(list(d.values()))                 # O(n)
print(list(d.items()))                  # O(n)

# Update / merge
d.update({"e": 5, "f": 6})              # O(k)
d |= {"g": 7}                           # O(k)  Python 3.9+
print(d)

# Clear / copy
d2 = d.copy()                           # shallow — O(n)
d2.clear()                              # O(n)

# 🔸 Iterating while mutating → RuntimeError
# for k in d:
#     del d[k]                          # ❌ RuntimeError: dict changed size during iteration

# ✅ Safe: iterate over a snapshot
for k in list(d.keys()):
    if k == "g":
        del d[k]

# 🧠 dict remembers INSERTION ORDER (Python 3.7+). Great for
#    stable iteration and building FIFO-like structures.


# ============================================================
#  5️⃣ SET — OPERATIONS AND COMPLEXITY
# ============================================================
# 🔹 set is dict without values — a bag of unique hashables.
# 🔸 Backed by the same hash table.

s: set[int] = {1, 2, 3}

s.add(4)                                # O(1)
s.discard(4)                            # O(1) — no error if missing
s.remove(3)                             # O(1) — raises KeyError if missing
# s.remove(99)                          # ❌ KeyError

print(2 in s)                           # O(1)

# Set algebra — all O(len(a) + len(b)) average
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(a | b)                            # union        {1,2,3,4,5,6}
print(a & b)                            # intersection {3,4}
print(a - b)                            # difference   {1,2}
print(a ^ b)                            # symmetric    {1,2,5,6}

# frozenset — immutable, hashable
fs = frozenset([1, 2, 3])
print(fs)                               # frozenset({1, 2, 3})
# fs.add(4)                             # ❌ AttributeError

# ⚠️ Sets are UNORDERED — never rely on iteration order.
print(list({1, 2, 3}))                  # [1, 2, 3] by accident, not guaranteed

# 🧠 Rule: use set when you only need "have I seen this?".
#    Use dict when you also need to associate a value.


# ============================================================
#  6️⃣ DICT / SET COMPREHENSIONS
# ============================================================
# 🔹 [k: v for ...] and {x for ...} — fast and readable.

# Dict from list of pairs
pairs = [("a", 1), ("b", 2)]
d1 = {k: v for k, v in pairs}
print(d1)                               # {'a': 1, 'b': 2}

# Dict from two lists
keys = ["x", "y", "z"]
vals = [10, 20, 30]
d2 = {k: v for k, v in zip(keys, vals)}
print(d2)                               # {'x': 10, 'y': 20, 'z': 30}

# Invert a dict (assumes unique values)
orig = {"a": 1, "b": 2}
inv = {v: k for k, v in orig.items()}
print(inv)                              # {1: 'a', 2: 'b'}

# Set comprehension
sq = {x * x for x in range(6)}
print(sq)                               # {0, 1, 4, 9, 16, 25}

# Conditional comprehension
even_squares = {x: x * x for x in range(10) if x % 2 == 0}
print(even_squares)                     # {0:0, 2:4, 4:16, 6:36, 8:64}

# 🧠 Comprehensions are faster than manual loops + assignments.


# ============================================================
#  7️⃣ COUNTER, DEFAULTDICT, ORDEREDDICT
# ============================================================
# 🔹 Counter      : dict subclass for counting.
# 🔹 defaultdict  : dict with default factory on missing key.
# 🔹 OrderedDict  : dict with reordering ops (rarely needed now).

from collections import Counter, defaultdict, OrderedDict

# ── Counter ──────────────────────────────────────────────────
c = Counter("mississippi")
print(c)                                # Counter({'i':4,'s':4,'p':2,'m':1})
print(c.most_common(2))                 # [('i',4),('s',4)]
c["z"] += 1                             # missing key auto-starts at 0
print(c["z"])                           # 1

# Counter arithmetic
c1 = Counter(a=2, b=1)
c2 = Counter(a=1, c=3)
print(c1 + c2)                          # adds counts
print(c1 - c2)                          # subtracts (drops ≤ 0)

# ── defaultdict ──────────────────────────────────────────────
# Auto-creates missing values via a factory function
grouped: defaultdict[str, list[int]] = defaultdict(list)
for x in [1, 2, 3, 4, 5]:
    grouped["even" if x % 2 == 0 else "odd"].append(x)
print(dict(grouped))                    # {'odd':[1,3,5], 'even':[2,4]}

counts: defaultdict[str, int] = defaultdict(int)
for ch in "hello":
    counts[ch] += 1
print(dict(counts))                     # {'h':1,'e':1,'l':2,'o':1}

# ⚠️ defaultdict creates entries on ACCESS even for reads:
d = defaultdict(int)
_ = d["missing"]                        # creates the key!
print(dict(d))                          # {'missing': 0}
# 🧠 Use dict.get(k, default) if you don't want this side effect.

# ── OrderedDict ──────────────────────────────────────────────
# Since 3.7 dict preserves order; OrderedDict still adds
# move_to_end and equality-as-order semantics.
od = OrderedDict([("a", 1), ("b", 2)])
od.move_to_end("a")
print(list(od))                         # ['b', 'a']

# 🧠 For 99% of problems, plain dict + Counter + defaultdict are
#    all you need.


# ============================================================
#  8️⃣ COMMON DSA PATTERNS
# ============================================================
# 🔹 FREQUENCY MAP — count occurrences in one pass.
def char_freq(s: str) -> dict[str, int]:
    freq: dict[str, int] = {}
    for ch in s:
        freq[ch] = freq.get(ch, 0) + 1
    return freq

print(char_freq("banana"))              # {'b':1,'a':3,'n':2}

# 🔹 TWO-SUM — find indices of two numbers summing to target.
def two_sum(xs: list[int], target: int) -> tuple[int, int] | None:
    seen: dict[int, int] = {}           # value → index
    for i, x in enumerate(xs):
        need = target - x
        if need in seen:
            return (seen[need], i)
        seen[x] = i
    return None

print(two_sum([2, 7, 11, 15], 9))       # (0, 1)
print(two_sum([3, 3], 6))               # (0, 1)
print(two_sum([1, 2, 3], 100))          # None

# 🔹 GROUP ANAGRAMS — group words by sorted-char signature.
def group_anagrams(words: list[str]) -> list[list[str]]:
    groups: dict[str, list[str]] = {}
    for w in words:
        key = "".join(sorted(w))        # or tuple(sorted(w))
        groups.setdefault(key, []).append(w)
    return list(groups.values())

print(group_anagrams(["eat", "tea", "tan", "ate", "nat", "bat"]))
# [['eat','tea','ate'], ['tan','nat'], ['bat']]

# 🔹 DEDUP PRESERVING ORDER
def dedup(xs: list[int]) -> list[int]:
    seen: set[int] = set()
    out: list[int] = []
    for x in xs:
        if x not in seen:
            seen.add(x)
            out.append(x)
    return out

print(dedup([1, 2, 1, 3, 2, 4]))        # [1, 2, 3, 4]

# 🔹 SUBARRAY SUM EQUALS K — prefix sum + hashmap.
def subarray_sum(xs: list[int], k: int) -> int:
    count = 0
    prefix = 0
    seen: dict[int, int] = {0: 1}
    for x in xs:
        prefix += x
        count += seen.get(prefix - k, 0)
        seen[prefix] = seen.get(prefix, 0) + 1
    return count

print(subarray_sum([1, 1, 1], 2))       # 2
print(subarray_sum([1, 2, 3], 3))       # 2

# 🔹 FIRST NON-REPEATING CHARACTER
def first_unique(s: str) -> str | None:
    freq = Counter(s)
    for ch in s:
        if freq[ch] == 1:
            return ch
    return None

print(first_unique("swiss"))            # w

# 🔹 INTERSECTION OF TWO ARRAYS
def intersection(a: list[int], b: list[int]) -> list[int]:
    return list(set(a) & set(b))

print(intersection([1, 2, 2, 3], [2, 2, 4]))  # [2]

# 🧠 Pattern recognition: "seen before", "count", "group by",
#    "pair up" → hash map. "unique" → set. "top-k" → Counter +
#    heap.


# ============================================================
#  9️⃣ COLLISIONS AND WORST-CASE BEHAVIOUR
# ============================================================
# 🔹 Collisions are when two keys hash to the same bucket index.
# 🔸 Python resolves via open addressing (probing).
# 🔸 Load factor kept low (~2/3) by resizing when needed.
# 🔸 Average O(1) assumes a good hash function.

# ⚠️ Worst case: many keys with identical hash → O(n) per op.
#    Real-world scenario: bad __hash__ on custom classes.

class BadKey:
    def __init__(self, v: int) -> None:
        self.v = v

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, BadKey):
            return NotImplemented
        return self.v == other.v

    def __hash__(self) -> int:
        return 0                            # ❌ everything collides

# Even then, correctness is preserved — only performance suffers.

# 🔸 Security: Python salts str hashes per process (PYTHONHASHSEED)
#    to prevent hash-flooding DoS.

# 🧠 Rule: always hash a TUPLE of the fields that define equality.


# ============================================================
#  🔟 EDGE CASES, PITFALLS, VERSION NOTES
# ============================================================
# ⚠️ Lists/dicts/sets are unhashable → cannot be keys.
#    Convert: tuple(...) or frozenset(...).
# ⚠️ Defining __eq__ without __hash__ makes the class unhashable.
# ⚠️ Modifying a dict while iterating raises RuntimeError.
# ⚠️ defaultdict creates missing keys on ACCESS — subtle bug.
# ⚠️ set iteration order is NOT guaranteed — never rely on it.
# ⚠️ dict insertion order IS guaranteed (3.7+) but not by hash.
# ⚠️ hash("...") is randomised per process — do not persist or
#    compare across runs.
# ⚠️ `d[k]` raises KeyError if missing; use `d.get(k)` or
#    `collections.defaultdict` to avoid.
# ⚠️ Sets can't contain lists, but they CAN contain tuples of
#    hashables.
# ⚠️ Empty set literal is set(), not {} (that's an empty dict).
print(type({}))                         # <class 'dict'>
print(type(set()))                      # <class 'set'>

# ⚠️ `in` on a list of dicts compares by ==, which is O(size of
#    each dict). Fine for small n, but converts poorly.
# ⚠️ Sets are great for membership, but iteration order is
#    arbitrary — sort explicitly if you need order.
# ⚠️ Counter subtract drops zero/negative counts; use -c or
#    subtract(...) for explicit behaviour.

# 🕒 Version notes
# - dict/set as built-in hash tables: from the start
# - dict comprehensions: Python 2.7+ / 3.0+
# - set literals {1, 2}: Python 2.7+ / 3.0+
# - frozenset: Python 2.4+
# - OrderedDict: Python 2.7+ / 3.1+
# - dict preserves insertion order: Python 3.7+ (CPython 3.6)
# - dict merge operators | and |=: Python 3.9+
# - `dict` union preserves order (left, then new keys from right)
# - `__hash__` reset to None when __eq__ defined: Python 3.0+
# - Hash randomisation for str/bytes: Python 3.3+


# ============================================================
#  📌 RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Operation              │ Average  │ Worst  │ Notes          |
# ─────────────────────────────────────────────────────────────
# | d[k] lookup            │ O(1)     │ O(n)   │ KeyError if none |
# | d[k] = v               │ O(1)     │ O(n)   │ —              |
# | k in d                 │ O(1)     │ O(n)   │ —              |
# | del d[k]               │ O(1)     │ O(n)   │ KeyError if none |
# | d.get(k, default)      │ O(1)     │ O(n)   │ safe           |
# | d.setdefault(k, v)     │ O(1)     │ O(n)   │ insert if none |
# | iteration              │ O(n)     │ O(n)   │ —              |
# | s.add(x)               │ O(1)     │ O(n)   │ —              |
# | s.discard(x)           │ O(1)     │ O(n)   │ —              |
# | a | b / a & b          │ O(n+m)   │ —      │ union/intersect|
# ─────────────────────────────────────────────────────────────
# | Structure       │ Best for                                     |
# ─────────────────────────────────────────────────────────────
# | dict            │ key → value mapping, counting, grouping      |
# | set             │ membership, dedup, set algebra               |
# | frozenset       │ hashable, immutable set (dict key / set elem) |
# | Counter         │ counting / top-k                             |
# | defaultdict     │ auto-init on missing key                     |
# | OrderedDict     │ rarely needed; move_to_end semantics         |
# ─────────────────────────────────────────────────────────────
# | Pattern              │ Recipe                                   |
# ─────────────────────────────────────────────────────────────
# | Frequency map        │ Counter(xs) or d[x] = d.get(x,0)+1       |
# | Dedup (ordered)      │ seen=set(); out=[]; loop                 |
# | Two-sum              │ seen={value: index}                      |
# | Group anagrams       │ key = "".join(sorted(w))                 |
# | Subarray sum = k     │ prefix sum + {prefix: count}             |
# | First unique         │ Counter + second pass                    |
# | Intersection         │ set(a) & set(b)                          |
# ─────────────────────────────────────────────────────────────
# | Pitfall                    │ Why it bites                   |
# ─────────────────────────────────────────────────────────────
# | Unhashable key (list)      │ TypeError                      |
# | __eq__ without __hash__    │ Unhashable class               |
# | Mutate dict during loop    │ RuntimeError                   |
# | defaultdict read creates   │ Silent key insertion           |
# | Relying on set order       │ Order not guaranteed           |
# | Persisting hash(x)         │ Salted per run                 |
# | Using `{}` for empty set   │ It's an empty dict             |
# | O(n) `in` on list          │ O(n²) loops                    |
# ─────────────────────────────────────────────────────────────
#
# 🧠 BEST PRACTICES
#  - Replace `x in list` with `x in set` whenever possible.
#  - Prefer dict.get(k, default) over try/except for one-offs.
#  - Use Counter for counting; defaultdict for grouping.
#  - Hash tuples of the fields that define equality.
#  - Never rely on set iteration order.
#  - Iterate over list(d) when mutating inside the loop.
#  - Remember `{}` is a dict; empty set is `set()`.
#  - For memory-heavy keys, consider hashing a reduced tuple.
#  - Know that hash() for strings is random per process.
#  - Reach for hash maps FIRST when the problem says "count",
#    "group", "seen", "pair", or "unique".
# ============================================================