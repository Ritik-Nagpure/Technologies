# 11_Edge_Cases_and_Version_Notes.py

# ============================================================
#  📘 OOP EDGE CASES, PITFALLS & VERSION NOTES
#
#  This final file collects the cross-cutting gotchas that
#  appear across the whole OOP series: attribute lookup, class
#  vs instance state, dunder coupling, inheritance traps,
#  metaclass behaviour, and version-specific features from
#  Python 2.x through 3.12+.
#
#  Sections:
#   1. Attribute lookup & shadowing pitfalls
#   2. Mutable state traps
#   3. Class-body execution surprises
#   4. __eq__ / __hash__ coupling
#   5. super() and MRO traps
#   6. Descriptor and property traps
#   7. Iteration and container traps
#   8. Metaclass & class-creation traps
#   9. bool / int / object surprises
#  10. Version timeline
#  11. Master recap
# ============================================================


# ============================================================
#  1️⃣ ATTRIBUTE LOOKUP & SHADOWING PITFALLS
# ============================================================
# 🔹 Lookup order for reads: data descriptor → instance dict →
#    non-data descriptor → class dict → __getattr__.
# 🔸 Assignments ALWAYS write to the instance dict (unless a
#    data descriptor intercepts).
# 🎯 Knowing this prevents 90% of "why is my attribute wrong?"

class Shadow:
    x = "class-x"                       # class attribute

s1, s2 = Shadow(), Shadow()
s1.x = "instance-x"                     # writes to s1.__dict__
print(s1.x, s2.x)                       # Output: instance-x class-x

del s1.x                                # reveals class attr again
print(s1.x)                             # Output: class-x

# ⚠️ Typo silently creates a NEW attribute
s1.y = 10
print(vars(s1))                         # Output: {'y': 10}

# ⚠️ Assigning to a class attr via instance does NOT modify the class
s2.x = "mutated"
print(Shadow.x)                         # Output: class-x

# 🧠 Use __slots__ or a linter to catch typos in attribute names.


# ============================================================
#  2️⃣ MUTABLE STATE TRAPS
# ============================================================
# 🔹 Three classic ways mutable state bites:
#     • Mutable default in __init__
#     • Mutable class attribute
#     • Shared default in function args (same root cause)

class Bad:
    tricks: list[str] = []              # ❌ shared class list

b1, b2 = Bad(), Bad()
b1.tricks.append("roll")
print(b2.tricks)                        # Output: ['roll']

# ✅ Fix — per-instance list
class Good:
    def __init__(self) -> None:
        self.tricks: list[str] = []

# ⚠️ Even worse: mutable default in __init__ signature
class Worse:
    def __init__(self, items: list[int] = []) -> None:  # ❌ shared!
        self.items = items

w1, w2 = Worse(), Worse()
w1.items.append(1)
print(w2.items)                         # Output: [1]

# ✅ Fix — sentinel None + local creation
class Best:
    def __init__(self, items: list[int] | None = None) -> None:
        self.items = list(items) if items is not None else []

# 🧠 Rule: ANY mutable default (class or function) is a bug
#    waiting to happen. Use default_factory or None sentinel.


# ============================================================
#  3️⃣ CLASS-BODY EXECUTION SURPRISES
# ============================================================
# 🔹 The class body runs ONCE at definition time — like a mini
#    function without a closure over the class.
# 🔸 Names inside the class body are NOT visible to methods
#    without `self.` or `Cls.` prefix.

class Counter:
    count = 10                          # class attribute
    doubled = count * 2                 # runs at class creation
                                        # → doubled = 20

    def bad(self) -> int:
        # return count * 2              # ❌ NameError — `count`
                                        #     not in method scope
        return self.count * 2           # ✅

print(Counter.doubled)                  # Output: 20
print(Counter().bad())                  # Output: 20

# ⚠️ The class body has its OWN namespace, discarded after the
#    class is created (except what's assigned to class attrs).

class Example:
    temp = 99                           # lives on the class
    del temp                            # 🧠 careful — no attr named temp
                                        #     created in the end

print(hasattr(Example, "temp"))         # Output: False

# ⚠️ Comprehensions in class bodies CANNOT see class-level names
class Weird:
    values = [1, 2, 3]
    # squares = [v * 2 for v in values] # ❌ NameError in Py3
    squares = [v * 2 for v in (1, 2, 3)]  # ✅ literal works

# 🧠 Class body ≈ a function body. Anything you want methods to
#    see must be on self or the class name.


# ============================================================
#  4️⃣ __eq__ / __HASH__ COUPLING
# ============================================================
# 🔹 If you define __eq__, Python sets __hash__ = None UNLESS you
#    explicitly define __hash__.
# 🔸 Equal objects MUST have equal hashes.
# 🔸 Mutable objects that define __eq__ should usually stay
#    unhashable.

class Point:
    def __init__(self, x: int, y: int) -> None:
        self.x, self.y = x, y

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Point):
            return NotImplemented
        return (self.x, self.y) == (other.x, other.y)

# {Point(1, 2)}                         # ❌ TypeError: unhashable type

# ✅ Add __hash__ on the same tuple
class PointOK:
    def __init__(self, x: int, y: int) -> None:
        self.x, self.y = x, y

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, PointOK):
            return NotImplemented
        return (self.x, self.y) == (other.x, other.y)

    def __hash__(self) -> int:
        return hash((self.x, self.y))

print(len({PointOK(1, 2), PointOK(1, 2)}))   # Output: 1

# ⚠️ If you override __eq__ in a SUBCLASS, __hash__ is reset to
#    None again — even if the parent was hashable.
class Point3D(PointOK):
    def __init__(self, x: int, y: int, z: int) -> None:
        super().__init__(x, y)
        self.z = z

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Point3D):
            return NotImplemented
        return (self.x, self.y, self.z) == (other.x, other.y, other.z)

    # ❌ forgot __hash__ → Point3D is unhashable again
    def __hash__(self) -> int:
        return hash((self.x, self.y, self.z))

# 🧠 Rule of thumb: whenever you write __eq__, write __hash__ too
#    (or accept unhashability deliberately).


# ============================================================
#  5️⃣ super() AND MRO TRAPS
# ============================================================
# 🔹 super() = "next class in MRO after the CURRENT class".
# 🔸 Non-cooperative parents break cooperative chains.
# 🔸 Calling Parent.method(self) instead of super() skips the rest
#    of the MRO.

class A:
    def greet(self) -> str: return "A"

class B(A):
    def greet(self) -> str: return "B -> " + super().greet()

class C(A):
    def greet(self) -> str: return "C -> " + super().greet()

class D(B, C):
    def greet(self) -> str: return "D -> " + super().greet()

print(D().greet())              # Output: D -> B -> C -> A
print([k.__name__ for k in D.mro()])    # Output: ['D', 'B', 'C', 'A', 'object']

# ❌ Non-cooperative: uses parent NAME, skipping C
class DBad(B, C):
    def greet(self) -> str:
        return "D -> " + B.greet(self)      # B's super() still → C? Yes, ok
                                            # but D bypassed C's own pre-hook

# ⚠️ Real trap: parent's super() lands on a sibling the caller
#    didn't expect. Always use super() cooperatively.

# 🧠 Rule: never call Parent.method(self) — always super().method().


# ============================================================
#  6️⃣ DESCRIPTOR AND PROPERTY TRAPS
# ============================================================
# 🔹 Descriptor instances are CLASS-level; state must live on the
#    instance, not the descriptor.
# 🔸 @property getter runs before instance dict is consulted.
# 🔸 cached_property needs a writable __dict__.

# ❌ Descriptor storing state on itself
class BadField:
    def __get__(self, obj, objtype=None): return self.value
    def __set__(self, obj, value): self.value = value   # shared!

class BadHolder:
    x = BadField()

h1, h2 = BadHolder(), BadHolder()
h1.x = 10
h2.x = 20
print(h1.x, h2.x)               # Output: 20 20  ← BUG

# ✅ Descriptor storing state on the instance
class GoodField:
    def __set_name__(self, owner, name): self.name = name
    def __get__(self, obj, objtype=None):
        if obj is None: return self
        return obj.__dict__.get(self.name)
    def __set__(self, obj, value):
        obj.__dict__[self.name] = value

class GoodHolder:
    x = GoodField()

g1, g2 = GoodHolder(), GoodHolder()
g1.x = 10
g2.x = 20
print(g1.x, g2.x)               # Output: 10 20

# ⚠️ @property + __init__ + validation: the __init__ assignment
#    goes through the setter, which is usually GOOD.
# ⚠️ cached_property cannot work with __slots__ (no __dict__).


# ============================================================
#  7️⃣ ITERATION AND CONTAINER TRAPS
# ============================================================
# 🔹 `in` uses __contains__ → __iter__ → __getitem__ (in that order).
# 🔸 __getitem__-based iteration only works with int indexes 0, 1, ...
# 🔸 Iterators are single-use; iterables are re-iterable.

class Bag:
    def __init__(self) -> None:
        self._items = [1, 2, 3]

    def __getitem__(self, i: int) -> int:
        return self._items[i]

b = Bag()
print(list(b))                  # Output: [1, 2, 3] — via __getitem__
print(list(b))                  # Output: [1, 2, 3] — re-iterable

# ⚠️ An iterator returns itself from __iter__ and is exhausted
#    after one pass.
class Counter:
    def __init__(self, n: int) -> None: self.n = n
    def __iter__(self): return self
    def __next__(self):
        if self.n == 0: raise StopIteration
        self.n -= 1
        return self.n + 1

c = Counter(3)
print(list(c))                  # Output: [3, 2, 1]
print(list(c))                  # Output: []  ← exhausted!

# 🧠 If you want re-iterable, return a fresh iterator from
#    __iter__ (e.g., `return iter(self._items)`).

# ⚠️ `for i in range(len(x))` is not Pythonic — iterate directly
#    or use enumerate() / zip().


# ============================================================
#  8️⃣ METACLASS & CLASS-CREATION TRAPS
# ============================================================
# 🔹 Every class is an instance of `type` (or a metaclass).
# 🔸 Only ONE metaclass per class; combining different metaclasses
#    requires one to subclass the other.
# 🔸 __init_subclass__ is the modern alternative to metaclasses
#    for many use cases.

class Meta(type):
    def __new__(mcs, name, bases, namespace):
        cls = super().__new__(mcs, name, bases, namespace)
        cls.created = True
        return cls

class UsesMeta(metaclass=Meta):
    pass

print(UsesMeta.created)         # Output: True

# ⚠️ Metaclass conflicts:
class MetaA(type): pass
class MetaB(type): pass

# class Broken(MetaA, MetaB):    # ❌ metaclass conflict
#     pass

# ✅ Fix: make one derive from the other
class MetaB2(MetaA): pass

class Fixed(metaclass=MetaB2): pass

# 🧠 Prefer __init_subclass__ over metaclasses:
class Registry:
    _all: dict[str, type] = {}
    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        Registry._all[cls.__name__] = cls

class PluginA(Registry): pass
class PluginB(Registry): pass
print(list(Registry._all))      # Output: ['PluginA', 'PluginB']


# ============================================================
#  9️⃣ bool / int / object SURPRISES
# ============================================================
# 🔹 bool is a subclass of int → True == 1, False == 0.
# 🔹 isinstance(True, int) is True.
# 🔹 All classes derive from object.
# 🔹 None is a singleton — always compare with `is None`.

print(isinstance(True, int))    # Output: True
print(True + True)              # Output: 2
print({True: "a", 1: "b"})      # Output: {True: 'b'} — same key!

# ⚠️ Because True == 1 and hash(True) == hash(1), they collide in
#    sets and dicts. Order your isinstance checks carefully.

def kind(x: object) -> str:
    if isinstance(x, bool):     # 🔸 bool FIRST
        return "bool"
    if isinstance(x, int):
        return "int"
    return type(x).__name__

print(kind(True), kind(1))      # Output: bool int

# 🧠 Always check bool before int when both branches matter.

# ⚠️ `is` vs `==` for None and singletons
x = None
print(x == None)                # Output: True   (bad style)
print(x is None)                # Output: True   (correct)

# ⚠️ Interning: small ints and short strings may be shared, so
#    `is` sometimes works "by accident" — never rely on it.
a = 256
b = 256
print(a is b)                   # Output: True (CPython interns -5..256)

c = 257
d = 257
print(c is d)                   # Output: False (usually, but not guaranteed)

# 🧠 Use `is` only for None, True, False, and sentinels.


# ============================================================
#  🔟 VERSION TIMELINE
# ============================================================
# 🕒 Python 2.2 — new-style classes, descriptor protocol
# 🕒 Python 2.3 — C3 linearisation (MRO)
# 🕒 Python 2.5 — @property decorator
# 🕒 Python 2.6 — @classmethod / @staticmethod syntax, abc module
# 🕒 Python 3.0 — zero-arg super(), all classes new-style,
#                  __hash__ = None when __eq__ defined
# 🕒 Python 3.3 — collections.abc moved out of collections
# 🕒 Python 3.4 — abc.ABC convenience base, functools.singledispatch
# 🕒 Python 3.5 — __matmul__ / @ operator, async context managers
# 🕒 Python 3.6 — __set_name__, __init_subclass__, f-strings
# 🕒 Python 3.7 — @dataclass (PEP 557), asynccontextmanager
# 🕒 Python 3.8 — typing.Protocol, functools.cached_property,
#                  singledispatchmethod, runtime_checkable
# 🕒 Python 3.9 — dict merge operators, PEP 585 generics (list[int]),
#                  classmethod(property(...)) trick becomes common
# 🕒 Python 3.10 — @dataclass(slots=True, kw_only=True, match_args=True),
#                   pattern matching (match/case), PEP 604 unions (X | Y)
# 🕒 Python 3.11 — exception groups, tomllib, @dataclass(weakref_slot=True),
#                   faster CPython (specialising interpreter)
# 🕒 Python 3.12 — PEP 695 type parameter syntax (class C[T]), f-string
#                   grammar, override decorator (typing.override)
# 🕒 Python 3.13 — experimental free-threaded builds, better REPL,
#                   PEP 696 defaults for typevars


# ============================================================
#  1️⃣1️⃣ MASTER RECAP
# ============================================================
# 📌 Four pillars of OOP — quick reference
# ─────────────────────────────────────────────────────────────
# | Pillar         │ Python mechanism                             |
# ─────────────────────────────────────────────────────────────
# | Encapsulation  │ _x / __x / @property                         |
# | Abstraction    │ abc.ABC / @abstractmethod / Protocol         |
# | Inheritance    │ class Child(Parent) / super() / MRO          |
# | Polymorphism   │ override / duck typing / dunders / Protocol  |
# ─────────────────────────────────────────────────────────────
#
# 📌 Class-body essentials
# ─────────────────────────────────────────────────────────────
# | Concept           │ Notes                                   |
# ─────────────────────────────────────────────────────────────
# | __init__          │ initializer, returns None                |
# | __new__           │ instance factory (rare)                  |
# | self              │ current instance                         |
# | cls               │ current class (@classmethod)             |
# | @staticmethod     │ no self / cls                            |
# | @property         │ managed attribute                        |
# | @cached_property  │ computed once (3.8+)                     |
# | @dataclass        │ auto __init__ / __repr__ / __eq__ (3.7+) |
# | __slots__         │ fixed attr set, no __dict__              |
# ─────────────────────────────────────────────────────────────
#
# 📌 Dunder cheat sheet
# ─────────────────────────────────────────────────────────────
# | Dunder             │ Enables                              |
# ─────────────────────────────────────────────────────────────
# | __init__           │ obj = Cls(args)                      |
# | __repr__ / __str__ │ repr(obj) / print(obj)               |
# | __eq__ / __lt__    │ ==, sorted()                         |
# | __hash__           │ set / dict keys                      |
# | __len__            │ len(obj)                             |
# | __getitem__        │ obj[i], iteration fallback           |
# | __iter__ / __next__│ for-loop                             |
# | __contains__       │ `x in obj`                           |
# | __add__ / __radd__ │ obj + x, x + obj                     |
# | __call__           │ obj(...)                             |
# | __enter__/__exit__ │ with obj:                            |
# | __getattr__        │ fallback on missing attribute        |
# ─────────────────────────────────────────────────────────────
#
# 📌 Attribute lookup order (reads)
# ─────────────────────────────────────────────────────────────
# 1. Data descriptor on class (has __set__ / __delete__)
# 2. Instance __dict__
# 3. Non-data descriptor on class (only __get__)
# 4. Class __dict__
# 5. Base classes (following MRO)
# 6. __getattr__ fallback
# ─────────────────────────────────────────────────────────────
#
# 🧠 MASTER BEST PRACTICES
#  - One class = one responsibility.
#  - Prefer composition over deep inheritance.
#  - Inherit only for real "is-a" relationships; otherwise mix in.
#  - Always call super().__init__() cooperatively with **kwargs.
#  - Never use mutable defaults (class body or function signature).
#  - Always define __repr__ for anything you'll debug.
#  - Pair __eq__ with __hash__ (or accept unhashability).
#  - Validate inputs in __init__ and in property setters.
#  - Use @dataclass for data-holders; regular class for behaviour.
#  - Prefer @property over get_x() / set_x() methods.
#  - Prefer Protocol over ABC when static checking is enough.
#  - Use __slots__ only on small, fixed-shape classes.
#  - Check bool before int in isinstance chains.
#  - Use `is` only for None / True / False / sentinels.
#  - Fail fast: ABC + validators catch bugs at definition time.
#  - Document the MRO when multiple inheritance is involved.
# ============================================================