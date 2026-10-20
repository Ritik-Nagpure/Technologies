# 03_Strings.py

# ============================================================
#  📘 STRINGS IN PYTHON — COMPLETE COVERAGE
#
#  A string in Python is an IMMUTABLE sequence of Unicode
#  characters. Because it's immutable, any "modification"
#  actually creates a new string — which is why building strings
#  with `+=` in a loop is a classic O(n²) trap. Strings are the
#  backbone of parsing, text processing, and half of all
#  interview questions.
#
#  This file covers: creation, indexing, slicing, immutability,
#  all common built-in methods with complexity, formatting,
#  encoding, and the interview-standard patterns (anagrams,
#  palindromes, char counting, two-pointer, sliding window).
#
#  Sections:
#   1. What a string actually is
#   2. Creating strings and f-strings
#   3. Indexing and slicing
#   4. Immutability and its consequences
#   5. Common built-in methods and their complexity
#   6. Splitting and joining
#   7. Formatting (f-string, format, %)
#   8. Unicode, encode/decode, ord/chr
#   9. Classic patterns (palindrome, anagram, char count)
#  10. Sliding window on strings
#  11. Edge cases, pitfalls, version notes
# ============================================================


# ============================================================
#  1️⃣ WHAT A STRING ACTUALLY IS
# ============================================================
# 🔹 A string is an immutable sequence of Unicode code points.
# 🔸 Index access is O(1), but a new string is created for any
#    "modification".
# 🎯 Immutability makes strings hashable (dict keys, set members).

s = "hello"
print(len(s))                           # 5
print(s[0], s[-1])                      # h o
print(type(s))                          # <class 'str'>

# 🔎 CPython stores strings with a flexible internal encoding
#    (ASCII / Latin-1 / UCS-2 / UCS-4) depending on the widest
#    character they contain. This makes small strings compact.

# 🧠 Rule of thumb: treat strings as READ-ONLY. To "modify",
#    build a NEW string (join, replace, slice).


# ============================================================
#  2️⃣ CREATING STRINGS AND F-STRINGS
# ============================================================
# 🔹 Literals : 'x', "x", '''multi-line''', """multi-line"""
# 🔹 Raw      : r"\n" (no escapes)
# 🔹 Bytes    : b"abc"
# 🔹 f-string : f"{value}" (fastest, most readable)
# 🔹 format() : "{}".format(value)

a = 'single'
b = "double"
c = """multi
line"""
d = r"C:\Users\name"                    # raw — \ is literal
e = f"sum 1+2 = {1 + 2}"                # f-string

name, age = "Ravi", 30
f1 = f"{name} is {age}"                 # ✅ f-string
f2 = "{} is {}".format(name, age)       # older but fine
f3 = "%s is %d" % (name, age)           # legacy style

print(a, b, c, d, e, f1, f2, f3, sep="\n")

# ✅ f-string with expression and format spec
pi = 3.14159
print(f"{pi:.2f}")                      # 3.14
print(f"{42:>10}")                      # right-aligned in 10 width
print(f"{42:04d}")                      # 0042
print(f"{name!r}")                      # 'Ravi' (repr)


# ============================================================
#  3️⃣ INDEXING AND SLICING
# ============================================================
# 🔹 Same rules as list: s[i], s[a:b], s[a:b:step], s[::-1].
# 🔸 Slicing NEVER raises IndexError — it clamps.

s = "abcdefg"
print(s[0], s[-1], s[2:5], s[::-1], s[::2], s[8:20])
# a g cde gfedcba aceg "" (empty because start > len)

# ✅ Reversing: s[::-1] is O(n).
# ✅ Every slice creates a NEW string.
print(s[:3], s[3:])                     # abc defg

# 🔎 Python 3.12+ allows nested quotes in f-strings:
# f"{"key"}" now works — previously syntax error.
# Keep simple for portability.


# ============================================================
#  4️⃣ IMMUTABILITY AND ITS CONSEQUENCES
# ============================================================
# 🔹 You cannot assign to s[i] — need a new string.
# 🔸 Consequences:
#     • "Modifying" a string is O(n) — it copies.
#     • Concatenation in a loop is O(n²).
#     • Strings can be dict keys / set members.

s = "hello"
# s[0] = "H"                            # ❌ TypeError: 'str' object does not support item assignment

# ✅ Rebuild instead
s2 = "H" + s[1:]
print(s2)                               # Hello

# ⚠️ The classic O(n²) concat trap:
def bad_concat(words: list[str]) -> str:
    out = ""
    for w in words:
        out += w                        # O(n) per step → O(n²) total
    return out

def good_concat(words: list[str]) -> str:
    return "".join(words)               # O(total length)

# 🧠 ALWAYS use "".join(...) to build a string from many pieces.


# ============================================================
#  5️⃣ COMMON BUILT-IN METHODS AND THEIR COMPLEXITY
# ============================================================
# 🔹 Know the cost so you don't accidentally write O(n²).

s = "  Hello World  "

s.strip()                               # O(n)  remove both ends
s.lstrip()                              # O(n)  left
s.rstrip()                              # O(n)  right
s.lower()                               # O(n)
s.upper()                               # O(n)
s.title()                               # O(n)
s.capitalize()                          # O(n)
s.swapcase()                            # O(n)

s.replace("World", "Python")            # O(n)  — returns NEW string
s.find("World")                         # O(n*m) worst, usually O(n)
s.rfind("l")                            # O(n)
s.index("l")                            # like find but raises
s.count("l")                            # O(n)

s.startswith(" He")                     # O(k) — k is prefix length
s.endswith("  ")                        # O(k)
s.isdigit()                             # O(n)
s.isalpha()                             # O(n)
s.isalnum()                             # O(n)
s.isspace()                             # O(n)
s.islower() / s.isupper()               # O(n)

s.split()                               # O(n)  whitespace split
s.split("o")                            # O(n)  custom delimiter
"abc".join(["x", "y", "z"])             # O(total length)

s.zfill(20)                             # O(n)
"42".center(10, "-")                    # O(n)
"a-b-c".partition("-")                  # O(n) → ("a", "-", "b-c")

# ⚠️ `in` on strings is substring search:
"World" in s                            # O(n*m) worst case
# 🧠 For heavy substring search, use `str.find` or a compiled
#    regex; for repeated work, KMP/Rabin-Karp.

# 🔎 Method chaining works because each returns a new string:
cleaned = "  Hello  ".strip().lower().replace("l", "L")
print(cleaned)                          # heLLo


# ============================================================
#  6️⃣ SPLITTING AND JOINING
# ============================================================
# 🔹 split()  → list[str]
# 🔹 join()   → str from iterable
# 🔸 join is the reverse of split — both are O(n).

csv_line = "ravi,30,engineer"
parts = csv_line.split(",")
print(parts)                            # ['ravi', '30', 'engineer']

# ✅ Rebuild
back = ",".join(parts)
print(back)                             # ravi,30,engineer

# 🔸 split with maxsplit
print("a:b:c:d".split(":", 2))          # ['a', 'b', 'c:d']

# 🔸 splitlines handles \n, \r\n, \r
print("a\nb\r\nc".splitlines())         # ['a', 'b', 'c']

# 🔸 rsplit from the right
print("a.b.c".rsplit(".", 1))           # ['a.b', 'c']

# ⚠️ split() with NO argument splits on ANY whitespace and
#    removes empty strings; split(" ") keeps empties.
print("a  b".split())                   # ['a', 'b']
print("a  b".split(" "))                # ['a', '', 'b']

# 🧠 Rule: "".join() beats += for building strings. Always.


# ============================================================
#  7️⃣ FORMATTING (F-STRING, FORMAT, %)
# ============================================================
# 🔹 Prefer f-strings (fastest, most readable).
# 🔸 `format()` and `%` still appear in legacy code.

name, score = "Ravi", 92.5

print(f"{name} scored {score:.1f}")             # Ravi scored 92.5
print("{n} scored {s:.1f}".format(n=name, s=score))  # same
print("%s scored %.1f" % (name, score))         # legacy

# 🔸 Alignment / padding
print(f"{'left':<10}|")                 # left      |
print(f"{'right':>10}|")                #      right|
print(f"{'center':^10}|")               #   center  |

# 🔸 Numbers
n = 1234567
print(f"{n:,}")                         # 1,234,567
print(f"{n:e}")                         # 1.234567e+06
print(f"{0.75:.2%}")                    # 75.00%

# 🔸 Debug helper (Python 3.8+): f"{expr=}"
x = 5
print(f"{x=}")                          # x=5

# 🧠 Rule: reach for f-strings first. Fall back only for
#    templating frameworks (e.g., logging) that defer formatting.


# ============================================================
#  8️⃣ UNICODE, ENCODE / DECODE, ord / chr
# ============================================================
# 🔹 Python 3 strings are Unicode; bytes are raw.
# 🔸 encode()  str → bytes
# 🔸 decode()  bytes → str
# 🔹 ord(c)    char → code point
# 🔹 chr(n)    code point → char

s = "café"
b = s.encode("utf-8")                   # b'caf\xc3\xa9'
print(b)
print(b.decode("utf-8"))                # café

print(ord("A"), chr(65))                # 65 A
print(ord("😀"))                        # 128512 (single code point)

# 🔸 Iterating a str walks code points, not bytes.
for ch in "ab😀":
    print(ch, ord(ch))

# ⚠️ len(s) counts CODE POINTS, not user-perceived characters.
#    Combining marks / emoji ZWJ sequences count as multiple.
s = "e\u0301"                           # é as e + combining accent
print(len(s))                           # 2, not 1

# 🔎 For grapheme-aware length, use `unicodedata` or the
#    `grapheme` package — rarely needed in interviews.
import unicodedata
print(unicodedata.normalize("NFC", s))  # single code point 'é'
print(len(unicodedata.normalize("NFC", s)))  # 1

# ⚠️ Encoding with the wrong codec raises UnicodeError.
# "café".encode("ascii")                # ❌ UnicodeEncodeError

# 🧠 Rule: use UTF-8 by default. Be explicit when reading files.


# ============================================================
#  9️⃣ CLASSIC PATTERNS
# ============================================================
# 🔹 PALINDROME — two-pointer, O(n) time, O(1) space.
def is_palindrome(s: str) -> bool:
    i, j = 0, len(s) - 1
    while i < j:
        if s[i] != s[j]:
            return False
        i += 1; j -= 1
    return True

print(is_palindrome("racecar"))         # True
print(is_palindrome("hello"))           # False

# 🔸 Palindromic sentence (ignore non-alnum, case)
def is_palindrome_clean(s: str) -> bool:
    cleaned = "".join(ch.lower() for ch in s if ch.isalnum())
    return cleaned == cleaned[::-1]

print(is_palindrome_clean("A man, a plan, a canal: Panama"))  # True

# 🔹 ANAGRAM — same character multiset.
def is_anagram(a: str, b: str) -> bool:
    if len(a) != len(b):
        return False
    return sorted(a) == sorted(b)       # O(n log n)

def is_anagram_fast(a: str, b: str) -> bool:
    if len(a) != len(b):
        return False
    from collections import Counter
    return Counter(a) == Counter(b)     # O(n)

print(is_anagram("listen", "silent"))   # True
print(is_anagram_fast("listen", "silent"))  # True

# 🔹 CHARACTER COUNT — Counter is the standard tool.
from collections import Counter

counts = Counter("mississippi")
print(counts)                           # Counter({'i':4,'s':4,'p':2,'m':1})
print(counts.most_common(2))            # [('i', 4), ('s', 4)]

# 🔹 REVERSE WORDS IN A SENTENCE
def reverse_words(s: str) -> str:
    return " ".join(s.split()[::-1])

print(reverse_words("the sky is blue"))  # blue is sky the


# ============================================================
#  🔟 SLIDING WINDOW ON STRINGS
# ============================================================
# 🔹 Classic problem: longest substring without repeating chars.
# 🔸 Maintain a window [l, r], expand r, shrink l on duplicates.
# 🔸 Track seen index → O(n) time, O(min(n, alphabet)) space.

def longest_unique_substring(s: str) -> int:
    last_seen: dict[str, int] = {}
    l = 0
    best = 0
    for r, ch in enumerate(s):
        if ch in last_seen and last_seen[ch] >= l:
            l = last_seen[ch] + 1
        last_seen[ch] = r
        best = max(best, r - l + 1)
    return best

print(longest_unique_substring("abcabcbb"))     # 3
print(longest_unique_substring("bbbbb"))        # 1
print(longest_unique_substring("pwwkew"))       # 3

# 🔹 Fixed-size window: max sum of any k-length window (numbers)
def max_sum_window(xs: list[int], k: int) -> int:
    if k <= 0 or k > len(xs):
        return 0
    window = sum(xs[:k])
    best = window
    for i in range(k, len(xs)):
        window += xs[i] - xs[i - k]
        best = max(best, window)
    return best

print(max_sum_window([1, 3, -1, -3, 5, 3, 6, 7], 3))  # 16

# 🧠 Sliding window converts an O(n*k) brute-force into O(n).


# ============================================================
#  1️⃣1️⃣ EDGE CASES, PITFALLS, VERSION NOTES
# ============================================================
# ⚠️ Strings are immutable — s[i] = ch raises TypeError.
# ⚠️ "+= in a loop" is O(n²) — use "".join().
# ⚠️ `in` on strings is substring search — O(n*m) worst case.
# ⚠️ len(s) is code points, not graphemes.
# ⚠️ Comparing strings is lexicographic by Unicode code point:
print("Z" < "a")                        # True  (uppercase < lowercase)
print("apple" < "banana")               # True
# ⚠️ Sorting strings is lexicographic — "file10" < "file2".
#    Use natural-sort keys if needed.
# ⚠️ `split()` vs `split(" ")` differ on consecutive whitespace.
# ⚠️ f-strings evaluate at runtime — don't use for lazy logging.
# ⚠️ `str.strip()` removes ALL leading/trailing whitespace, not
#    just one char, unless you pass a set of chars.
print("xxhixx".strip("x"))              # hi
# ⚠️ `replace` replaces ALL occurrences unless you pass count.
print("aaa".replace("a", "b", 1))       # baa
# ⚠️ Using mutable default in a function that takes a string is
#    fine — but the same rule about mutables in list args still
#    applies.
# ⚠️ `str()` on an object calls __str__; if missing → __repr__.
# ⚠️ F-strings cannot contain backslashes inside the {} in
#    versions before 3.12 — use a variable instead.

# 🕒 Version notes
# - f-strings: Python 3.6+
# - `=` debug specifier in f-strings (f"{x=}"): Python 3.8+
# - Nested quotes in f-strings: Python 3.12+
# - `str.removeprefix` / `str.removesuffix`: Python 3.9+
# - `str.isascii()`: Python 3.7+
# - `str.format_map`: Python 3.2+
# - Unicode string by default (Py3): everything is str, not bytes
# - `str.maketrans` / `str.translate` for multi-char remap: 3.0+

# 🔎 removeprefix / removesuffix (3.9+)
print("unhappy".removeprefix("un"))     # happy
print("file.txt".removesuffix(".txt"))  # file

# 🔎 translate for fast char mapping (built from maketrans)
table = str.maketrans("abc", "xyz")
print("cab".translate(table))           # zxy

# 🔎 Comparing many strings with `casefold` (better than lower for
#    non-ASCII, e.g., German ß)
print("Straße".casefold() == "STRASSE".casefold())  # True


# ============================================================
#  📌 RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Operation              │ Average cost    │ Notes           |
# ─────────────────────────────────────────────────────────────
# | s[i]                   │ O(1)            │ index           |
# | s[a:b]                 │ O(b-a)          │ new string      |
# | s + t                  │ O(len s + t)    │ copies          |
# | "".join(it)            │ O(total length) │ preferred       |
# | s.split(sep)           │ O(n)            │ new list        |
# | s.replace(a, b)        │ O(n)            │ new string      |
# | s.find(sub)            │ O(n*m) worst    │ substring scan  |
# | sub in s               │ O(n*m) worst    │ substring scan  |
# | s.strip()              │ O(n)            │ whitespace      |
# | s.lower() / upper()    │ O(n)            │ new string      |
# | s.startswith(p)        │ O(len p)        │ —               |
# | len(s)                 │ O(1)            │ cached          |
# ─────────────────────────────────────────────────────────────
# | Pattern                │ Recipe                              |
# ─────────────────────────────────────────────────────────────
# | Reverse                │ s[::-1]                             |
# | Palindrome             │ two-pointer or s == s[::-1]         |
# | Anagram                │ Counter(a) == Counter(b)            |
# | Char count             │ collections.Counter(s)              |
# | Split/join round-trip  │ sep.join(s.split(sep))              |
# | Fast substring         │ re / str.find / KMP                 |
# | Build in loop          │ "".join(parts) not +=              |
# ─────────────────────────────────────────────────────────────
# | Pitfall                     │ Why it bites                    |
# ─────────────────────────────────────────────────────────────
# | s[i] = ch                   │ Strings are immutable           |
# | out += w in loop            │ O(n²) — use "".join              |
# | len("é"): 2 not 1           │ Code points ≠ graphemes         |
# | split() vs split(" ")       │ Different whitespace rules      |
# | "Z" < "a"                   │ Case-sensitive code-point order |
# | Wrong codec on encode()     │ UnicodeEncodeError              |
# | Backslash in f-string expr  │ SyntaxError before 3.12         |
# | sub in s for heavy search   │ O(n*m) — precompile regex       |
# ─────────────────────────────────────────────────────────────
#
# 🧠 BEST PRACTICES
#  - Treat strings as immutable values; build new ones.
#  - Use "".join() to concatenate many pieces.
#  - Prefer f-strings over % and format().
#  - Use Counter for char-frequency problems.
#  - Use slicing for reverse / copy — it's O(n) and clear.
#  - For repeated substring search, precompile a regex or use KMP.
#  - Remember len(s) counts code points, not user-perceived chars.
#  - Specify encoding="utf-8" explicitly when reading/writing files.
#  - Casefold for case-insensitive comparison, not lower.
#  - Watch the "+=" inside loops — it hides O(n²) cost.
#  - Use removeprefix/removesuffix (3.9+) instead of slicing tricks.
# ============================================================