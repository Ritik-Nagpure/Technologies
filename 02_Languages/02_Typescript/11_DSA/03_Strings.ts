// 03_Strings.ts

/* ============================================================
 *  📘 STRINGS IN TYPESCRIPT — COMPLETE COVERAGE
 *
 *  A JavaScript/TypeScript string is an IMMUTABLE sequence of
 *  UTF-16 code units. Because it's immutable, any "modification"
 *  creates a new string — which is why building strings with
 *  `+=` in a loop is a classic O(n²) trap. Strings are the
 *  backbone of parsing, text processing, and half of all
 *  interview questions.
 *
 *  This file covers: creation, indexing, slicing, immutability,
 *  all common built-in methods with complexity, template
 *  literals, Unicode (code points vs code units vs graphemes),
 *  and interview-standard patterns (anagrams, palindromes,
 *  char counting, two-pointer, sliding window).
 *
 *  Sections:
 *   1. What a string actually is
 *   2. Creating strings and template literals
 *   3. Indexing, charAt, codePointAt
 *   4. Slicing — slice, substring, substr
 *   5. Immutability and its consequences
 *   6. Common built-in methods and their complexity
 *   7. Splitting and joining
 *   8. Template literals and tag functions
 *   9. Unicode, code units, encodeURI, TextEncoder
 *  10. Classic patterns (palindrome, anagram, char count)
 *  11. Sliding window on strings
 *  12. Edge cases, pitfalls, version notes
 * ============================================================ */


/* ============================================================
 *  1️⃣ WHAT A STRING ACTUALLY IS
 * ============================================================ */
// 🔹 Strings are immutable sequences of UTF-16 code units.
// 🔸 Index access is O(1), but any "modification" creates a new
//    string.
// 🎯 Immutability + primitive semantics let strings be used as
//    Map keys and object keys safely.

const s: string = "hello";
console.log(s.length);              // 5
console.log(s[0], s[s.length - 1]); // h o
console.log(typeof s);              // "string"

// 🔎 Engines (V8) represent strings as:
//    - One-byte (Latin1) for ASCII-only strings
//    - Two-byte (UTF-16) for non-Latin1 strings
//    - "Cons strings" for concatenation (lazy flattening)
//    - "Sliced strings" for substrings (view into parent)
//    This is why some operations are faster than the naive count.

// 🧠 Rule of thumb: treat strings as READ-ONLY. To "modify",
//    build a NEW string (split/join, replace, slice).


/* ============================================================
 *  2️⃣ CREATING STRINGS AND TEMPLATE LITERALS
 * ============================================================ */
// 🔹 Literals      : 'x', "x"
// 🔹 Template      : `x ${expr} y` — multi-line, interpolation
// 🔹 String()      : String(value)
// 🔹 From char codes: String.fromCharCode(72, 105)
// 🔹 From code point: String.fromCodePoint(0x1F600)

const a: string = "single";
const b: string = "double";
const multi: string = `line 1
line 2`;
const name: string = "Ravi";
const age: number = 30;
const t: string = `${name} is ${age}`;
console.log(t);                     // Ravi is 30

// 🔸 Expression inside ${} can be any JS expression:
const total: string = `sum = ${1 + 2 + 3}`;
console.log(total);                 // sum = 6

// 🔸 Tagged template literal (advanced)
function tag(strings: TemplateStringsArray, ...values: unknown[]): string {
  return strings.reduce(
    (acc, str, i) => acc + str + (i < values.length ? String(values[i]) : ""),
    "",
  );
}
console.log(tag`sum = ${1 + 2}`);   // "sum = 3"

// 🧠 Prefer template literals over string concatenation — clearer
//    and often faster for small interpolations.

// ⚠️ Template literals evaluate at runtime — don't use for lazy
//    logging without wrapping in a function.


/* ============================================================
 *  3️⃣ INDEXING, charAt, codePointAt
 * ============================================================ */
// 🔹 s[i]           : code unit at index (may be a surrogate half)
// 🔹 s.charAt(i)    : same as s[i], returns "" if out of range
// 🔹 s.codePointAt(i): Unicode code point at index (handles pairs)
// 🔹 String.fromCodePoint(cp): reverse
// 🔸 length is in UTF-16 code units, not characters.

const str: string = "hello";
console.log(str[0], str[4]);        // h o
console.log(str[100]);              // undefined
console.log(str.charAt(100));       // "" (empty string)

// 🔎 Char codes vs code points:
const emoji: string = "😀";
console.log(emoji.length);          // 2 — surrogate pair
console.log(emoji.codePointAt(0));  // 128512
console.log(String.fromCodePoint(128512)); // 😀

// 🔸 Iterate by CODE POINT (not code unit):
for (const ch of "a😀b") {
  console.log(ch, ch.codePointAt(0));
}
// a 97
// 😀 128512
// b 98

// ⚠️ Plain for-loop iterates code units — emoji get split:
for (let i = 0; i < "a😀b".length; i++) {
  console.log(i, "a😀b"[i]);
}
// 0 'a', 1 '�', 2 '�', 3 'b'

// 🧠 Rule: use for...of to iterate characters safely. Use
//    Array.from(s) or [...s] to get an array of code points.


/* ============================================================
 *  4️⃣ SLICING — slice, substring, substr
 * ============================================================ */
// 🔹 slice(a, b)     : [a, b), supports negative indices ✅
// 🔹 substring(a, b) : [a, b), swaps if a > b, NO negatives
// 🔹 substr(a, len)  : deprecated — avoid
// 🔸 All return NEW strings.
// 🎯 Use slice() — it's the modern, unambiguous choice.

const str2: string = "abcdefg";
console.log(str2.slice(0, 3));      // "abc"
console.log(str2.slice(-3));        // "efg"
console.log(str2.slice(1, -1));     // "bcdef"
console.log(str2.substring(0, 3));  // "abc"
console.log(str2.substring(3, 0));  // "abc" — swaps!

// ⚠️ substring(-3) treats -3 as 0, unlike slice:
console.log(str2.substring(-3));    // "abcdefg"
console.log(str2.slice(-3));        // "efg"

// 🧠 Prefer slice — predictable and supports negatives.

// 🔸 Safe substring operations
function safeSlice(s: string, start: number, end?: number): string {
  if (start < 0) start = Math.max(0, s.length + start);
  return s.slice(start, end);
}


/* ============================================================
 *  5️⃣ IMMUTABILITY AND ITS CONSEQUENCES
 * ============================================================ */
// 🔹 You cannot assign to s[i].
// 🔸 Consequences:
//     • "Modifying" a string is O(n) — it copies.
//     • Concatenation in a loop is O(n²).
//     • Strings can be Map/Set keys.

let greet: string = "hello";
// greet[0] = "H";                  // ❌ silently ignored (non-strict)
//                                 //  or TypeError in strict mode

// ✅ Rebuild instead
greet = "H" + greet.slice(1);
console.log(greet);                 // "Hello"

// ⚠️ The classic O(n²) concat trap:
function badConcat(words: readonly string[]): string {
  let out = "";
  for (const w of words) {
    out += w;                       // O(n) per step → O(n²)
  }
  return out;
}

function goodConcat(words: readonly string[]): string {
  return words.join("");            // O(total length)
}

// 🧠 ALWAYS use array.join("") to build a string from many pieces.
//    Some JS engines optimise += with "rope" strings, but do NOT
//    rely on it — join() is guaranteed linear.


/* ============================================================
 *  6️⃣ COMMON BUILT-IN METHODS AND THEIR COMPLEXITY
 * ============================================================ */
// 🔹 Know the cost so you don't accidentally write O(n²).

const st: string = "  Hello World  ";

st.trim();                          // O(n)
st.trimStart();                     // O(n)
st.trimEnd();                       // O(n)
st.toLowerCase();                   // O(n)
st.toUpperCase();                   // O(n)
st.normalize("NFC");                // O(n) — Unicode normalisation

st.replace("World", "TS");          // O(n) — first occurrence
st.replaceAll("l", "L");            // O(n) — all (ES2021)

st.indexOf("World");                // O(n)
st.lastIndexOf("l");                // O(n)
st.includes("Hello");               // O(n)
st.startsWith(" ");                 // O(k) — k = prefix length
st.endsWith("  ");                  // O(k)

st.repeat(2);                       // O(n * k)
st.padStart(20, "*");               // O(n)
st.padEnd(20, "*");                 // O(n)
st.charAt(0);                       // O(1)
st.charCodeAt(0);                   // O(1)

"42".padStart(5, "0");              // "00042"

// 🔸 Conversion
"42".length;                        // 2
parseInt("42", 10);                 // 42  — always specify radix
Number("3.14");                     // 3.14
(255).toString(16);                 // "ff"
(255).toString(2);                  // "11111111"

// ⚠️ `in` / `includes` on strings is a substring search O(n·m)
//    worst case (naive). For repeated search, use KMP / a regex.
"World".includes(st);               // wrong direction — false
st.includes("World");               // true

// 🔸 Method chaining (each returns a new string)
const cleaned: string = "  Hello  ".trim().toLowerCase().replaceAll("l", "L");
console.log(cleaned);               // "heLLo"

// 🧠 Rule: methods return NEW strings — chain freely but watch
//    repeated O(n) copies in hot loops.


/* ============================================================
 *  7️⃣ SPLITTING AND JOINING
 * ============================================================ */
// 🔹 split()  → string[]   (O(n))
// 🔹 join()   → string from array (O(n))
// 🔸 They are inverses.

const csv: string = "ravi,30,engineer";
const parts: string[] = csv.split(",");
console.log(parts);                 // ["ravi", "30", "engineer"]

const back: string = parts.join(",");
console.log(back);                  // ravi,30,engineer

// 🔸 split with limit
console.log("a:b:c:d".split(":", 2));       // ["a", "b"]

// 🔸 split by regex
console.log("a1b22c333d".split(/\d+/));     // ["a", "b", "c", "d"]

// 🔸 Split into characters (code points!)
console.log([..."hello"]);          // ["h", "e", "l", "l", "o"]
console.log(Array.from("😀a"));      // ["😀", "a"]

// ⚠️ "hello".split("") splits by CODE UNIT — emoji get broken.
console.log("😀a".split(""));        // ["\uD83D", "\uDE00", "a"]

// 🔸 Sentence reverse (the classic)
function reverseWords(s: string): string {
  return s.split(/\s+/).filter(Boolean).reverse().join(" ");
}
console.log(reverseWords("the sky  is blue"));  // "blue is sky the"

// 🧠 Rule: "".join() beats += for building strings. Always.
//    Use spread [...s] for code-point iteration, split("") for
//    code units (rarely wanted).


/* ============================================================
 *  8️⃣ TEMPLATE LITERALS AND TAG FUNCTIONS
 * ============================================================ */
// 🔹 Backticks with ${...} interpolation and multi-line support.
// 🔸 Tagged templates receive raw strings + interpolated values.
// 🎯 Used by SQL builders, CSS-in-JS, HTML sanitisers.

const name2 = "World";
const greeting = `Hello, ${name2}!`;
console.log(greeting);              // Hello, World!

// 🔸 Multi-line with formatting
const html = `
  <div>
    <h1>${name2}</h1>
  </div>
`;
console.log(html.trim());

// 🔸 Tagged template for safe HTML escaping
function safeHtml(strings: TemplateStringsArray, ...values: unknown[]): string {
  const escaped = values.map((v) =>
    String(v).replace(/[&<>"']/g, (ch) => {
      const map: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };
      return map[ch] ?? ch;
    }),
  );
  return strings.reduce(
    (acc, str, i) => acc + str + (i < escaped.length ? escaped[i] : ""),
    "",
  );
}

const userInput = "<script>alert(1)</script>";
console.log(safeHtml`<p>${userInput}</p>`);
// "<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>"

// 🧠 Tag functions give you the RAW strings — this is the
//    foundation of safe SQL/HTML builders.
// ⚠️ Never build SQL/HTML with plain template literals and
//    user input — use a tagged template + escaping, or a
//    dedicated library.


/* ============================================================
 *  9️⃣ UNICODE, CODE UNITS, ENCODEURI, TEXTENCODER
 * ============================================================ */
// 🔹 JS strings are UTF-16 — some "characters" are 2 code units.
// 🔸 codePointAt / fromCodePoint handle full code points.
// 🔸 Grapheme clusters (emoji ZWJ, combining marks) need
//    Intl.Segmenter (Node 16+, modern browsers).

const emoji2: string = "👨‍👩‍👧";        // family emoji
console.log(emoji2.length);         // 8 code units!
console.log([...emoji2].length);    // 5 code points
// Grapheme count = 1 — need Intl.Segmenter:
const seg = new Intl.Segmenter("en", { granularity: "grapheme" });
console.log([...seg.segment("👨‍👩‍👧")].length); // 1

// 🔸 Normalisation
const combining: string = "e\u0301";     // e + combining acute
const composed: string = "é";            // single codepoint
console.log(combining === composed);     // false!
console.log(combining.normalize("NFC") === composed); // true

// 🔸 Encoding / decoding
console.log(encodeURIComponent("a b&c"));  // "a%20b%26c"
console.log(decodeURIComponent("a%20b%26c")); // "a b&c"

// 🔸 TextEncoder / TextDecoder for UTF-8 bytes (Node 11+, modern browsers)
const encoder = new TextEncoder();
const bytes: Uint8Array = encoder.encode("café");
console.log(bytes);                 // Uint8Array [99, 97, 102, 195, 169]

const decoder = new TextDecoder("utf-8");
console.log(decoder.decode(bytes)); // "café"

// 🧠 Rule: for parsing/len use code points or grapheme clusters,
//    never .length, when input may be non-ASCII.
// 🧠 Normalise (NFC) before comparing user-entered Unicode.


/* ============================================================
 *  🔟 CLASSIC PATTERNS
 * ============================================================ */
// 🔹 PALINDROME — two-pointer, O(n) time, O(1) space
function isPalindrome(s: string): boolean {
  let i = 0;
  let j = s.length - 1;
  while (i < j) {
    if (s[i] !== s[j]) return false;
    i += 1;
    j -= 1;
  }
  return true;
}
console.log(isPalindrome("racecar"));       // true
console.log(isPalindrome("hello"));         // false

// 🔸 Palindromic sentence — ignore non-alnum, case
function isPalindromeClean(s: string): boolean {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned === [...cleaned].reverse().join("");
}
console.log(isPalindromeClean("A man, a plan, a canal: Panama")); // true

// 🔹 ANAGRAM — same character multiset
function isAnagram(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const counts = new Map<string, number>();
  for (const ch of a) counts.set(ch, (counts.get(ch) ?? 0) + 1);
  for (const ch of b) {
    const c = counts.get(ch);
    if (!c) return false;
    if (c === 1) counts.delete(ch);
    else counts.set(ch, c - 1);
  }
  return counts.size === 0;
}

console.log(isAnagram("listen", "silent")); // true

// 🔸 Anagram via sorting (shorter, O(n log n))
function isAnagramSort(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return [...a].sort().join("") === [...b].sort().join("");
}

// 🔹 CHARACTER COUNT — Map is the standard tool.
function charFreq(s: string): Map<string, number> {
  const freq = new Map<string, number>();
  for (const ch of s) freq.set(ch, (freq.get(ch) ?? 0) + 1);
  return freq;
}
console.log(charFreq("banana"));    // Map { 'b' => 1, 'a' => 3, 'n' => 2 }

// 🔹 REVERSE WORDS IN A SENTENCE
function reverseWords2(s: string): string {
  return s.trim().split(/\s+/).reverse().join(" ");
}
console.log(reverseWords2("the sky is blue")); // "blue is sky the"


/* ============================================================
 *  1️⃣1️⃣ SLIDING WINDOW ON STRINGS
 * ============================================================ */
// 🔹 Classic: longest substring without repeating chars.
// 🔸 Maintain a window [l, r], expand r, shrink l on duplicates.
// 🎯 O(n) time, O(k) space where k = distinct chars.

function longestUniqueSubstring(s: string): number {
  const last = new Map<string, number>();
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (ch === undefined) continue;
    const prev = last.get(ch);
    if (prev !== undefined && prev >= left) left = prev + 1;
    last.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}

console.log(longestUniqueSubstring("abcabcbb"));    // 3
console.log(longestUniqueSubstring("bbbbb"));       // 1
console.log(longestUniqueSubstring("pwwkew"));      // 3

// 🔹 Fixed-size window: count substrings of length k with all
//    distinct chars (example)
function countDistinctWindows(s: string, k: number): number {
  if (k <= 0 || k > s.length) return 0;
  const counts = new Map<string, number>();
  let distinct = 0;
  for (let i = 0; i < s.length; i++) {
    const add = s[i];
    if (add === undefined) continue;
    counts.set(add, (counts.get(add) ?? 0) + 1);

    if (i >= k) {
      const remove = s[i - k];
      if (remove !== undefined) {
        const c = counts.get(remove) ?? 0;
        if (c === 1) counts.delete(remove);
        else counts.set(remove, c - 1);
      }
    }
    if (i >= k - 1 && counts.size === k) distinct += 1;
  }
  return distinct;
}

console.log(countDistinctWindows("abcabcbb", 3));   // 5

// 🧠 Sliding window converts O(n*k) brute-force into O(n).


/* ============================================================
 *  1️⃣2️⃣ EDGE CASES, PITFALLS, VERSION NOTES
 * ============================================================ */
// ⚠️ Strings are immutable — s[i] = ch is ignored (or throws
//    in strict mode). Rebuild instead.
// ⚠️ "+= in a loop" is O(n²) — use array.join().
// ⚠️ s.includes(sub) is O(n*m) worst case.
// ⚠️ s.length is UTF-16 code units — not graphemes, sometimes
//    not even code points.
// ⚠️ split("") breaks surrogate pairs — use [...s] or
//    Array.from(s) for code points.
// ⚠️ substring swaps arguments; slice does not. Prefer slice.
// ⚠️ substr is deprecated — don't use it.
// ⚠️ charCodeAt returns UTF-16 code unit; codePointAt returns
//    the code point (may be > 0xFFFF).
// ⚠️ Comparing strings is lexicographic by UTF-16 code unit:
console.log("Z" < "a");             // true (uppercase < lowercase)
console.log("apple" < "banana");    // true
// ⚠️ Sorting strings lexicographically — "file10" < "file2".
//    Use Intl.Collator for locale-aware sorting.
const collator = new Intl.Collator("en", { numeric: true });
console.log(["file10", "file2", "file1"].sort(collator.compare));
// ["file1", "file2", "file10"]

// ⚠️ Use casefold-ish comparison via toLowerCase / toUpperCase
//    for case-insensitive. For robust Unicode, use localeCompare
//    with sensitivity.
console.log("A".localeCompare("a", undefined, { sensitivity: "base" })); // 0

// ⚠️ Never build SQL or HTML from raw template literals with
//    user input — use tagged templates + escaping, or a library.
// ⚠️ Normalise Unicode (NFC) before comparing user input.
// ⚠️ Regex without /g replaces only the first match — use
//    replaceAll or /g for all.
console.log("aaa".replace("a", "b"));        // "baa"
console.log("aaa".replaceAll("a", "b"));     // "bbb"
console.log("aaa".replace(/a/g, "b"));       // "bbb"

/* 🕒 Version notes
 * - Template literals: ES2015
 * - String.prototype.includes / startsWith / endsWith: ES2015
 * - String.prototype.repeat / padStart / padEnd: ES2017
 * - String.prototype.trimStart / trimEnd: ES2019
 * - String.prototype.replaceAll: ES2021
 * - String.prototype.at: ES2022
 * - Object.hasOwn: ES2022
 * - Array.prototype.findLast: ES2023
 * - Intl.Segmenter: ES2022 / Node 16+
 * - TextEncoder / TextDecoder: global in Node 11+
 * - No built-in grapheme-aware length in JS — Intl.Segmenter
 *   is the standard way
 * - Unicode-aware regex: /u flag (ES2015)
 * - TypeScript string literal types: TS 1.8+
 */


/* ============================================================
 *  📌 RECAP TABLE
 * ─────────────────────────────────────────────────────────────
 * | Operation              │ Average cost    │ Notes           |
 * ─────────────────────────────────────────────────────────────
 * | s[i] / s.charAt(i)     │ O(1)            │ UTF-16 code unit|
 * | s.codePointAt(i)       │ O(1)            │ full code point |
 * | s.length               │ O(1)            │ UTF-16 length   |
 * | s + t                  │ O(len s + t)    │ copies          |
 * | [].join("")            │ O(total length) │ preferred       |
 * | s.slice(a, b)          │ O(b-a)          │ new string      |
 * | s.split(sep)           │ O(n)            │ new array       |
 * | s.replace(a, b)        │ O(n)            │ first match     |
 * | s.replaceAll(a, b)     │ O(n)            │ all matches     |
 * | s.indexOf(sub)         │ O(n)            │ substring scan  |
 * | s.includes(sub)        │ O(n·m) worst    │ substring scan  |
 * | s.startsWith(p)        │ O(len p)        │ —               |
 * | s.toLowerCase()        │ O(n)            │ new string      |
 * | s.trim()               │ O(n)            │ whitespace      |
 * ─────────────────────────────────────────────────────────────
 * | Pattern                │ Recipe                              |
 * ─────────────────────────────────────────────────────────────
 * | Reverse                │ [...s].reverse().join("")           |
 * | Palindrome             │ two-pointer or s === reverse        |
 * | Anagram                │ Map counts, or sorted compare       |
 * | Char count             │ new Map<string, number>()           |
 * | Split/join round-trip  │ s.split(sep).join(sep)              |
 * | Fast substring         │ regex / KMP (large inputs)          |
 * | Build in loop          │ array.join("") not +=              |
 * | Grapheme count         │ Intl.Segmenter                      |
 * ─────────────────────────────────────────────────────────────
 * | Pitfall                     │ Why it bites                    |
 * ─────────────────────────────────────────────────────────────
 * | s[i] = ch                   │ Strings are immutable           |
 * | out += w in loop            │ O(n²) — use join                |
 * | .length on emoji            │ UTF-16 units, not chars         |
 * | split("") on emoji          │ Breaks surrogate pairs          |
 * | substring negative indices  │ Clamped, not negative           |
 * | substr deprecated           │ Use slice                       |
 * | "Z" < "a"                   │ Code-unit order                 |
 * | replace without /g          │ Only first match                |
 * | Unsafe template literals    │ XSS / SQL injection             |
 * | No normalise on Unicode     │ Comparison fails                |
 * ─────────────────────────────────────────────────────────────
 *
 * 🧠 BEST PRACTICES
 *  - Treat strings as immutable values; build new ones.
 *  - Use array.join("") to concatenate many pieces.
 *  - Prefer template literals over manual concatenation.
 *  - Use Map for char frequency (any key type).
 *  - Use slice, not substring or substr.
 *  - Iterate by code point with [...s] or for...of.
 *  - Normalise Unicode (NFC) before comparing input.
 *  - Use Intl.Segmenter for grapheme-aware operations.
 *  - Never build SQL/HTML from raw template literals with user
 *    input — use tagged templates + escaping.
 *  - Use localeCompare / Intl.Collator for locale-aware
 *    sorting.
 *  - Remember .length counts UTF-16 code units.
 *  - Test with: empty string, single char, all-same, emoji,
 *    combining marks, and very long input.
 *  - Watch += inside loops — it hides O(n²) cost.
 *  - Use replaceAll or /g for global replacements.
 * ============================================================ */