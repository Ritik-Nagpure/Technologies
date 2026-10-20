# 06_Dunder_Methods.py

# ============================================================
#  📘 DUNDER (MAGIC) METHODS IN PYTHON — COMPLETE COVERAGE
#
#  "Dunder" = Double UNDERscore. Methods like __init__, __str__,
#  __eq__, __len__, __getitem__ let YOUR objects integrate with
#  Python's built-in syntax and protocols: printing, comparing,
#  iterating, adding, calling, hashing, context managers, etc.
#
#  Mastering dunders is what separates "a class in Python" from
#  "a Pythonic class". This file covers the most useful dunders
#  grouped by purpose, plus the rules for returning NotImplemented
#  and the hidden coupling between __eq__ and __hash__.
#
#  Sections:
#   1. Why dunders matter
#   2. Lifecycle: __new__, __init__, __del__
#   3. Representation: __str__, __repr__, __format__
#   4. Comparison: __eq__, __lt__, __hash__, total_ordering
#   5. Arithmetic & operators: __add__, __radd__, __iadd__, ...
#   6. Container protocol: __len__, __getitem__, __contains__
#   7. Iteration: __iter__, __next__
#   8. Callable & context manager: __call__, __enter__/__exit__
#   9. Attribute access: __getattr__, __setattr__, __getattribute__
#  10. Edge cases, pitfalls, version notes
# ============================================================


# ============================================================
#  1️⃣ WHY DUNDERS MATTER
# ============================================================
# 🔹 Dunders define HOW your object behaves with Python's syntax.
# 🔹 They are invoked implicitly, never called directly.
# 🎯 Goal: make your class feel built-in, not bolted-on.

class Money:
    def __init__(self, amount: int) -> None:
        self.amount = amount

    def __repr__(self) -> str:
        return f"Money({self.amount})"

    def __add__(self, other: "Money") -> "Money":
        return Money(self.amount + other.amount)

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Money):
            return NotImplemented
        return self.amount == other.amount

m = Money(100) + Money(50)
print(m)                        # Output: Money(150)
print(m == Money(150))          # Output: True

# 🧠 Each dunder you add makes your object work with more of
#    Python for free (sorted, in, len, with, etc.).


# ============================================================
#  2️⃣ LIFECYCLE: __new__, __init__, __del__
# ============================================================
# 🔹 __new__    → creates the instance (rarely overridden).
# 🔹 __init__   → initializes the instance (the usual one).
# 🔹 __del__    → called when object is garbage-collected
#                  (do NOT rely on it for cleanup).

class Singleton:
    _instance: "Singleton | None" = None

    def __new__(cls) -> "Singleton":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self) -> None:      # runs every time on get
        self.tag = "shared"

a = Singleton()
b = Singleton()
print(a is b)                    # Output: True

# ⚠️ __del__ timing is unpredictable. Use context managers
#    (__enter__/__exit__) or try/finally for real cleanup.
# ⚠️ __init__ is skipped if __new__ returns an object of a
#    DIFFERENT class.


# ============================================================
#  3️⃣ REPRESENTATION: __str__, __repr__, __format__
# ============================================================
# 🔹 __repr__  → developer view (REPL, debugger).
# 🔹 __str__   → user view (print); falls back to __repr__.
# 🔹 __format__→ f-strings / format() spec handling.

class Point:
    def __init__(self, x: int, y: int) -> None:
        self.x, self.y = x, y

    def __repr__(self) -> str:
        return f"Point({self.x}, {self.y})"

    def __str__(self) -> str:
        return f"({self.x}, {self.y})"

    def __format__(self, spec: str) -> str:
        if spec == "polar":
            import math
            r = math.hypot(self.x, self.y)
            theta = math.degrees(math.atan2(self.y, self.x))
            return f"r={r:.2f}, theta={theta:.1f}°"
        return str(self)

p = Point(3, 4)
print(p)                        # Output: (3, 4)
print(repr(p))                  # Output: Point(3, 4)
print(f"{p}")                   # Output: (3, 4)
print(f"{p:polar}")             # Output: r=5.00, theta=53.1°

# 🧠 ALWAYS define __repr__. __str__ is optional.
#    If you only define one, define __repr__.


# ============================================================
#  4️⃣ COMPARISON: __eq__, __lt__, __hash__, total_ordering
# ============================================================
# 🔹 __eq__  → ==  (and != via inverse)
# 🔹 __lt__  → <   (also enables sorted, min, max)
# 🔹 __hash__→ hash(obj) — required for set / dict keys.
# 🔸 If you define __eq__ and want hashing, define __hash__ too.

class Version:
    def __init__(self, major: int, minor: int) -> None:
        self.major, self.minor = major, minor

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Version):
            return NotImplemented
        return (self.major, self.minor) == (other.major, other.minor)

    def __lt__(self, other: "Version") -> bool:
        return (self.major, self.minor) < (other.major, other.minor)

    def __hash__(self) -> int:
        return hash((self.major, self.minor))

    def __repr__(self) -> str:
        return f"Version({self.major}.{self.minor})"

vs = [Version(1, 2), Version(3, 0), Version(1, 0)]
print(sorted(vs))               # Output: [Version(1.0), Version(1.2), Version(3.0)]

# ✅ total_ordering fills in <=, >, >= from __eq__ + __lt__
from functools import total_ordering

@total_ordering
class Score:
    def __init__(self, value: int) -> None:
        self.value = value

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Score): return NotImplemented
        return self.value == other.value

    def __lt__(self, other: "Score") -> bool:
        return self.value < other.value

print(Score(5) <= Score(10))    # Output: True
print(Score(5) > Score(10))     # Output: False

# ⚠️ Defining __eq__ without __hash__ makes the class unhashable.
class Unhashable:
    def __eq__(self, other: object) -> bool:
        return True
# {Unhashable()}                # ❌ TypeError: unhashable type

# 🧠 Rule: eq ⇄ hash. If equal objects should hash the same,
#    define __hash__ on the same tuple/key fields.


# ============================================================
#  5️⃣ ARITHMETIC & OPERATORS
# ============================================================
# 🔹 Forward:  __add__, __sub__, __mul__, __truediv__, __mod__
# 🔹 Reflected:__radd__, __rsub__, ...  (other + self)
# 🔹 In-place: __iadd__, __imul__, ... (self += x)
# 🔹 Unary:    __neg__, __pos__, __abs__, __invert__

class Vector:
    def __init__(self, x: float, y: float) -> None:
        self.x, self.y = x, y

    def __add__(self, other: "Vector") -> "Vector":
        return Vector(self.x + other.x, self.y + other.y)

    def __radd__(self, other: "Vector") -> "Vector":
        return self.__add__(other)

    def __iadd__(self, other: "Vector") -> "Vector":
        self.x += other.x
        self.y += other.y
        return self

    def __mul__(self, k: float) -> "Vector":
        return Vector(self.x * k, self.y * k)

    def __rmul__(self, k: float) -> "Vector":
        return self.__mul__(k)

    def __neg__(self) -> "Vector":
        return Vector(-self.x, -self.y)

    def __repr__(self) -> str:
        return f"Vector({self.x}, {self.y})"

v = Vector(1, 2)
print(v + Vector(3, 4))         # Output: Vector(4, 6)
print(2 * v)                    # Output: Vector(2, 4)
print(-v)                       # Output: Vector(-1, -2)
v += Vector(1, 1)
print(v)                        # Output: Vector(2, 3)

# ⚠️ __iadd__ MUST return self — otherwise `x += y` rebinds x to
#    whatever you returned (which is usually a bug).
# ⚠️ Return NotImplemented (not raise) when the other operand
#    is unsupported → lets Python try the reflected method.


# ============================================================
#  6️⃣ CONTAINER PROTOCOL: __len__, __getitem__, __contains__
# ============================================================
# 🔹 __len__      → len(obj)
# 🔹 __getitem__  → obj[i]  (also enables for-loops if no __iter__)
# 🔹 __setitem__  → obj[i] = v
# 🔹 __delitem__  → del obj[i]
# 🔹 __contains__ → `x in obj` (defaults to iterating)

class Deck:
    def __init__(self, cards: list[str]) -> None:
        self._cards = cards

    def __len__(self) -> int:
        return len(self._cards)

    def __getitem__(self, i: int) -> str:
        return self._cards[i]

    def __contains__(self, card: object) -> bool:
        return card in self._cards

    def __repr__(self) -> str:
        return f"Deck({self._cards!r})"

d = Deck(["A", "K", "Q"])
print(len(d))                   # Output: 3
print(d[0])                     # Output: A
print("K" in d)                 # Output: True
print(list(d))                  # Output: ['A', 'K', 'Q'] — via __getitem__

# ⚠️ __getitem__ with an int must support both positive & negative
#    indexes AND raise IndexError (not KeyError) for out-of-range.
#    Easiest: delegate to an underlying list/tuple.


# ============================================================
#  7️⃣ ITERATION: __iter__ AND __next__
# ============================================================
# 🔹 __iter__  → returns an iterator (usually `self` or iter(data)).
# 🔹 __next__  → returns the next value, raises StopIteration at end.
# 🔸 Two patterns: iterator class (both) or iterable returning
#    iter(existing collection).

class Countdown:
    def __init__(self, start: int) -> None:
        self.n = start

    def __iter__(self) -> "Countdown":
        return self

    def __next__(self) -> int:
        if self.n <= 0:
            raise StopIteration
        self.n -= 1
        return self.n + 1

print(list(Countdown(3)))       # Output: [3, 2, 1]

# ✅ Simpler: return an iterator from an existing collection
class Sentence:
    def __init__(self, text: str) -> None:
        self._words = text.split()

    def __iter__(self):
        return iter(self._words)

print(list(Sentence("hello there world")))
# Output: ['hello', 'there', 'world']

# ⚠️ Forgetting StopIteration → infinite loop.
# 🧠 Prefer __iter__ returning iter(...) over writing both.


# ============================================================
#  8️⃣ CALLABLE & CONTEXT MANAGER
# ============================================================
# 🔹 __call__       → makes the instance callable like a function.
# 🔹 __enter__/__exit__ → `with` statement support.

class Multiplier:
    def __init__(self, k: int) -> None:
        self.k = k

    def __call__(self, x: int) -> int:
        return self.k * x

double = Multiplier(2)
print(double(5))                # Output: 10

class Resource:
    def __enter__(self) -> "Resource":
        print("open")
        return self

    def __exit__(self, exc_type, exc, tb) -> bool:
        print("close")
        return False            # False → propagate exceptions

with Resource() as r:
    print("using resource")
# Output: open
#         using resource
#         close

# ⚠️ __exit__ returning True SWALLOWS exceptions — usually wrong.
# 🧠 Use @contextlib.contextmanager for simple cases.

from contextlib import contextmanager

@contextmanager
def tag(name: str):
    print(f"<{name}>")
    yield
    print(f"</{name}>")

with tag("b"):
    print("hi")
# Output: <b>
#         hi
#         </b>


# ============================================================
#  9️⃣ ATTRIBUTE ACCESS: __getattr__, __setattr__, __getattribute__
# ============================================================
# 🔹 __getattr__      → called only when normal lookup FAILS.
# 🔹 __setattr__      → called on EVERY attribute assignment.
# 🔹 __getattribute__ → called on EVERY attribute read (rarely needed).
# 🎯 Use __getattr__ for lazy / default attributes.

class Config:
    def __init__(self) -> None:
        self._data = {"host": "localhost", "port": 8080}

    def __getattr__(self, name: str):
        # Only reached if normal lookup fails
        try:
            return self._data[name]
        except KeyError:
            raise AttributeError(name)

    def __setattr__(self, name: str, value: object) -> None:
        if name == "_data":
            super().__setattr__(name, value)  # internal
        else:
            self._data[name] = value

c = Config()
print(c.host)                   # Output: localhost
c.port = 9090                   # goes through __setattr__
print(c.port)                   # Output: 9090

# ⚠️ __getattribute__ intercepts EVERYTHING including dunders —
#    a wrong implementation breaks the object entirely.
# ⚠️ __setattr__ must call super().__setattr__ to actually store,
#    or you'll get infinite recursion.
# 🧠 Reach for __getattr__ first; __getattribute__ is a last resort.


# ============================================================
#  🔟 EDGE CASES, PITFALLS, VERSION NOTES
# ============================================================
# ⚠️ Returning anything other than NotImplemented from a dunder
#    when types don't match can silently break dispatch.
# ⚠️ __eq__ without __hash__ → unhashable class.
# ⚠️ __hash__ without __eq__ → default identity equality.
# ⚠️ Mutable objects that define __eq__ should usually NOT be
#    hashable — hashing makes them unusable in sets/dicts once
#    mutated.
# ⚠️ __str__/__repr__ should NEVER have side effects.
# ⚠️ `sorted()` uses __lt__ only; `min`/`max` too.
# ⚠️ `x in obj` prefers __contains__ → __iter__ → __getitem__.

# 🕒 Version notes
# - __hash__ auto-set to None when __eq__ defined: Python 3.0+
# - functools.total_ordering: Python 2.7 / 3.2+
# - __format__: Python 2.6+
# - __index__ (for int-like indexes): Python 2.5+
# - __matmul__ / @ operator: Python 3.5+
# - async context managers (__aenter__/__aexit__): Python 3.5+
# - @contextlib.asynccontextmanager: Python 3.7+

# 🔎 __matmul__ example (Python 3.5+)
class Matrix:
    def __init__(self, m: list[list[int]]) -> None:
        self.m = m

    def __matmul__(self, other: "Matrix") -> "Matrix":
        # toy: element-wise for illustration
        return Matrix([[a * b for a, b in zip(r1, r2)]
                       for r1, r2 in zip(self.m, other.m)])

m1 = Matrix([[1, 2], [3, 4]])
m2 = Matrix([[2, 2], [2, 2]])
print((m1 @ m2).m)              # Output: [[2, 4], [6, 8]]

# 🔎 async context manager (Python 3.5+)
class AsyncResource:
    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc, tb) -> bool:
        return False

# import asyncio
# async def main():
#     async with AsyncResource():
#         print("inside")
# asyncio.run(main())


# ============================================================
#  📌 RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Category     │ Dunders                                        |
# ─────────────────────────────────────────────────────────────
# | Lifecycle    │ __new__, __init__, __del__                    |
# | Print        │ __str__, __repr__, __format__                 |
# | Compare      │ __eq__, __lt__, __gt__, __le__, __ge__, __ne__|
# | Hash         │ __hash__                                      |
# | Arithmetic   │ __add__, __sub__, __mul__, __truediv__, __mod__|
# | Reflected    │ __radd__, __rsub__, __rmul__, ...             |
# | In-place     │ __iadd__, __isub__, __imul__, ...             |
# | Unary        │ __neg__, __pos__, __abs__, __invert__         |
# | Container    │ __len__, __getitem__, __setitem__, __delitem__, __contains__ |
# | Iteration    │ __iter__, __next__                            |
# | Callable     │ __call__                                      |
# | Context mgr  │ __enter__, __exit__ / __aenter__, __aexit__   |
# | Attributes   │ __getattr__, __setattr__, __getattribute__    |
# | Numeric      │ __int__, __float__, __bool__, __index__       |
# ─────────────────────────────────────────────────────────────
# | Pitfall                    │ Why it bites                    |
# ─────────────────────────────────────────────────────────────
# | Return not NotImplemented  │ Breaks operator dispatch        |
# | __eq__ w/o __hash__        │ Class becomes unhashable        |
# | __iadd__ not returning self│ x += y rebinds unexpectedly     |
# | __exit__ returning True    │ Swallows exceptions silently    |
# | __getattribute__ recursion │ Must call super()               |
# | No StopIteration           │ Infinite loop                   |
# | Side effects in __str__    │ print() has hidden cost         |
# ─────────────────────────────────────────────────────────────
#
# 🧠 BEST PRACTICES
#  - Always define __repr__ for anything you'll debug.
#  - Define __eq__ + __hash__ together when you want value equality.
#  - Use @total_ordering instead of writing all six comparators.
#  - Return NotImplemented from dunders on type mismatch.
#  - __iadd__ and friends must return self.
#  - Prefer context managers over __del__ for cleanup.
#  - Only overload operators when the meaning is intuitive.
#  - Never put side effects in __str__ / __repr__.
#  - Use __getattr__ for lazy defaults; avoid __getattribute__.
# ============================================================