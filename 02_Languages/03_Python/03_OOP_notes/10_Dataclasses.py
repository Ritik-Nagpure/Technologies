# 10_Dataclasses.py

# ============================================================
#  📘 DATACLASSES IN PYTHON — COMPLETE COVERAGE
#
#  `@dataclass` auto-generates boilerplate __init__, __repr__,
#  and __eq__ from class-level type annotations. It is the
#  modern, idiomatic way to write small data-holding classes
#  without hand-writing dunders. Comes with options for
#  immutability, ordering, slots, and per-field metadata.
#
#  Sections:
#   1. Why dataclasses exist
#   2. Your first dataclass
#   3. Default values and default_factory
#   4. Immutability with frozen=True
#   5. Ordering with order=True
#   6. Slots with slots=True
#   7. Post-init processing (__post_init__)
#   8. Inheritance
#   9. field() options — repr, compare, metadata
#  10. Dataclass vs regular class vs NamedTuple vs Pydantic
#  11. Edge cases, pitfalls, version notes
# ============================================================


# ============================================================
#  1️⃣ WHY DATACLASSES EXIST
# ============================================================
# 🔹 90% of small classes are "just data + a bit of behaviour".
# 🔹 Writing __init__, __repr__, __eq__ by hand is repetitive.
# 🔸 @dataclass generates them from type-annotated fields.
# 🎯 Goal: fewer lines, same rigour.

# ❌ Manual version — 10 lines of boilerplate
class PointManual:
    def __init__(self, x: int, y: int) -> None:
        self.x = x
        self.y = y

    def __repr__(self) -> str:
        return f"PointManual(x={self.x}, y={self.y})"

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, PointManual):
            return NotImplemented
        return (self.x, self.y) == (other.x, other.y)

# ✅ Dataclass version — one decorator does it all
from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int

p1 = Point(1, 2)
p2 = Point(1, 2)
print(p1)                       # Output: Point(x=1, y=2)
print(p1 == p2)                 # Output: True

# 🧠 If a class is mostly data, use @dataclass. If it's mostly
#    behaviour, a regular class is often clearer.


# ============================================================
#  2️⃣ YOUR FIRST DATACLASS
# ============================================================
# 🔹 Fields are declared as CLASS-LEVEL annotations.
# 🔸 Order of fields = order of __init__ parameters.
# 🔸 Types are NOT enforced at runtime — they're documentation.

@dataclass
class User:
    name: str
    age: int
    email: str = ""

u = User("Ravi", 30, "ravi@example.com")
print(u.name, u.age, u.email)   # Output: Ravi 30 ravi@example.com
print(u)                        # Output: User(name='Ravi', age=30, email='...')

# ⚠️ Type annotations are checked only by tools like mypy/pyright,
#    NOT at runtime.
bad = User("Ravi", "not-an-int")   # ✅ allowed at runtime
print(bad)                      # Output: User(name='Ravi', age='not-an-int', email='')

# 🔎 Fields WITHOUT defaults must come BEFORE fields with defaults.
# @dataclass
# class Bad:
#     x: int = 0
#     y: int              # ❌ TypeError: non-default after default


# ============================================================
#  3️⃣ DEFAULT VALUES AND default_factory
# ============================================================
# 🔹 Simple defaults: assign directly.
# 🔸 MUTABLE defaults (list/dict/set) need field(default_factory=...).
# 🎯 Same reason as function default arguments — shared mutables.

from dataclasses import field

@dataclass
class Team:
    name: str
    members: list[str] = field(default_factory=list)
    scores: dict[str, int] = field(default_factory=dict)

t1 = Team("Alpha")
t2 = Team("Beta")
t1.members.append("Ravi")
print(t1.members)               # Output: ['Ravi']
print(t2.members)               # Output: []  ← independent

# ❌ Using a mutable default directly is a classic bug:
# @dataclass
# class BadTeam:
#     members: list[str] = []   # ❌ ValueError: mutable default

# 🧠 Rule: for list/dict/set/object, ALWAYS use default_factory.


# ============================================================
#  4️⃣ IMMUTABILITY WITH frozen=True
# ============================================================
# 🔹 frozen=True makes instances hashable and read-only.
# 🔸 Attempts to set attributes raise FrozenInstanceError.
# 🎯 Use for value objects, keys, config.

from dataclasses import FrozenInstanceError

@dataclass(frozen=True)
class Config:
    host: str
    port: int

c = Config("localhost", 8080)
print(c)                        # Output: Config(host='localhost', port=8080)

# c.port = 9090                 # ❌ FrozenInstanceError

# ✅ Frozen dataclasses are hashable → usable in sets / dict keys
print(hash(c))                  # Output: <some int>
configs = {c, Config("localhost", 8080)}
print(len(configs))             # Output: 1

# ⚠️ frozen only blocks attribute REASSIGNMENT — it does not
#    deep-freeze nested mutable objects.
@dataclass(frozen=True)
class Holder:
    items: list[int]

h = Holder([1, 2])
h.items.append(3)               # ✅ allowed — mutates inner list
print(h.items)                  # Output: [1, 2, 3]

# 🧠 For deep immutability, use tuples / MappingProxyType / frozen
#    dataclasses recursively.


# ============================================================
#  5️⃣ ORDERING WITH order=True
# ============================================================
# 🔹 Generates __lt__, __le__, __gt__, __ge__ from fields.
# 🔸 Sorts by fields in DECLARATION order (like tuples).
# ⚠️ Cannot be combined with frozen=False on hash-excluded fields.

@dataclass(order=True)
class Version:
    major: int
    minor: int
    patch: int = 0

versions = [Version(1, 10), Version(1, 2), Version(2, 0), Version(1, 2, 1)]
print(sorted(versions))
# Output: [Version(1, 2, 0), Version(1, 2, 1), Version(1, 10, 0), Version(2, 0, 0)]

print(Version(1, 2) < Version(1, 10))   # Output: True
print(Version(2, 0) > Version(1, 99))   # Output: True

# ⚠️ `order=True` also implies the same comparison rule as tuples —
#    field order MATTERS. Put the most significant field first.
# 🧠 If you need custom ordering, write __lt__ manually or use
#    functools.total_ordering on a regular class.


# ============================================================
#  6️⃣ SLOTS WITH slots=True
# ============================================================
# 🔹 slots=True converts the dataclass into a slotted class.
# 🔸 Slightly faster attribute access, lower memory usage.
# 🔸 Prevents accidental new attributes.
# 🕒 Python 3.10+

@dataclass(slots=True)
class Coord:
    x: int
    y: int

c = Coord(1, 2)
print(c.x, c.y)                 # Output: 1 2

# c.z = 3                       # ❌ AttributeError: no attribute 'z'
# print(c.__dict__)             # ❌ AttributeError: no __dict__

# ⚠️ slots=True breaks:
#   • Multiple inheritance with non-slotted classes
#   • cached_property (needs __dict__)
#   • Any code that relies on `obj.__dict__`
# 🧠 Use it for small, high-volume objects (points, records,
#    event objects in tight loops).

# 🔎 Pre-3.10 alternative: declare __slots__ manually AFTER
#    the @dataclass decorator:
@dataclass
class CoordOld:
    __slots__ = ("x", "y")
    x: int
    y: int
# Note: this pattern is fragile — prefer @dataclass(slots=True).


# ============================================================
#  7️⃣ POST-INIT PROCESSING (__post_init__)
# ============================================================
# 🔹 __post_init__ runs AFTER __init__ — for validation or derived
#    fields.
# 🔸 Great place to compute things that depend on multiple fields.

@dataclass
class Rectangle:
    width: float
    height: float
    area: float = field(init=False)     # 🔸 not in __init__

    def __post_init__(self) -> None:
        if self.width <= 0 or self.height <= 0:
            raise ValueError("Dimensions must be positive")
        self.area = self.width * self.height

r = Rectangle(3, 4)
print(r.area)                   # Output: 12.0

# Rectangle(-1, 4)              # ❌ ValueError: Dimensions must be positive

# 🔎 field(init=False) marks a field the caller must NOT provide.
#    You set it in __post_init__.

# ✅ Alternative: use __post_init__ to normalise inputs
@dataclass
class Person:
    name: str
    age: int

    def __post_init__(self) -> None:
        self.name = self.name.strip().title()
        if self.age < 0:
            raise ValueError("Age cannot be negative")

p = Person("  ravi kumar ", 30)
print(p.name)                   # Output: Ravi Kumar


# ============================================================
#  8️⃣ INHERITANCE
# ============================================================
# 🔹 Child dataclasses inherit parent fields.
# 🔸 Field order: parents' fields come FIRST.
# ⚠️ Non-default fields cannot follow defaulted ones.

@dataclass
class Animal:
    name: str
    sound: str = "..."

@dataclass
class Dog(Animal):
    breed: str = "unknown"

d = Dog("Rex", "Woof", "Labrador")
print(d)
# Output: Dog(name='Rex', sound='Woof', breed='Labrador')

# ⚠️ If a parent has a defaulted field, the child can't add a
#    non-defaulted field after it.
# @dataclass
# class Bad(Dog):
#     age: int                # ❌ non-default after default
# 🧠 Either give the child field a default, or reorder fields,
#    or use field(default=...) explicitly.

# 🔎 __post_init__ chains: subclasses should call super().__post_init__()
@dataclass
class Employee(Animal):
    salary: float = 0.0

    def __post_init__(self) -> None:
        if hasattr(super(), "__post_init__"):
            super().__post_init__()     # cooperative
        if self.salary < 0:
            raise ValueError("Salary cannot be negative")

e = Employee("Ravi", "Woof", "Engineer", 50000)
print(e.salary)                 # Output: 50000


# ============================================================
#  9️⃣ field() OPTIONS
# ============================================================
# 🔹 field(default=...), field(default_factory=...)
# 🔹 field(init=False), field(repr=False), field(compare=False)
# 🔹 field(metadata={...}) — arbitrary metadata for frameworks

@dataclass
class Product:
    id: int
    name: str = field(compare=False)        # excluded from __eq__
    price: float = 0.0
    internal: str = field(default="", repr=False, compare=False)

    # metadata is used by libraries like Pydantic, SQLAlchemy, etc.
    sku: str = field(default="", metadata={"label": "SKU code"})

p1 = Product(1, "Book", 10.0)
p2 = Product(1, "BookRenamed", 10.0)
print(p1 == p2)                 # Output: True  ← name excluded
print(p1)                       # Output: Product(id=1, name='Book', price=10.0, sku='')

# 🧠 Use compare=False for audit fields (updated_at), display
#    fields (name), or internal caches you don't want in equality.

# 🔎 Excluded-from-repr fields still exist — repr=False just hides
#    them in the generated __repr__.


# ============================================================
#  🔟 DATACLASS vs REGULAR CLASS vs NamedTuple vs Pydantic
# ============================================================
# 🔹 dataclass : best default for data-holding classes.
# 🔹 NamedTuple : immutable, tuple-based, indexing works.
# 🔹 Pydantic   : runtime validation + parsing (external lib).
# 🔹 Regular class : use when behaviour dominates.

from typing import NamedTuple

class PointNT(NamedTuple):
    x: int
    y: int

nt = PointNT(1, 2)
print(nt.x, nt[0])              # Output: 1 1  ← attribute + index access
# nt.x = 10                    # ❌ immutable

# 🎯 Choose dataclass when you need:
#   • mutable default behaviour
#   • __post_init__ hooks
#   • slots / order / frozen options
#   • fields with metadata
#
# 🎯 Choose NamedTuple when:
#   • immutability + tuple behaviour matter
#   • you want positional unpacking `x, y = point`
#
# 🎯 Choose Pydantic when:
#   • you need RUNTIME type validation / coercion
#   • you parse JSON into typed models


# ============================================================
#  1️⃣1️⃣ EDGE CASES, PITFALLS, VERSION NOTES
# ============================================================
# ⚠️ Field order: non-default BEFORE default; parents before
#    children.
# ⚠️ Mutable defaults MUST use default_factory.
# ⚠️ frozen=True only blocks rebinding, not nested mutation.
# ⚠️ order=True uses field order — put the key field first.
# ⚠️ slots=True is incompatible with cached_property, __dict__,
#    and multiple inheritance from non-slotted classes.
# ⚠️ Inherited dataclasses can't add non-default fields after
#    a parent's defaulted field.
# ⚠️ `field(init=False)` fields must still be declared with a
#    type annotation.
# ⚠️ __post_init__ runs once per instance, but is NOT called by
#    base __init__ automatically in inheritance unless you call
#    super().__post_init__().
# ⚠️ Dataclasses are NOT a validation framework — bad data passes
#    through unless you check it in __post_init__.

# 🕒 Version notes
# - dataclasses module: Python 3.7+ (PEP 557)
# - field(metadata=...): 3.7+
# - frozen=True: 3.7+
# - order=True: 3.7+
# - slots=True: Python 3.10+
# - kw_only=True (make all fields keyword-only): Python 3.10+
# - match_args=True (used by pattern matching): Python 3.10+
# - weakref_slot: Python 3.11+ (adds __weakref__ slot)
# - __slots__ generated by slots=True: 3.10+

# 🔎 kw_only example — allows non-default fields after defaulted ones
@dataclass(kw_only=True)
class Request:
    method: str = "GET"
    url: str                    # ✅ allowed — must be passed by keyword

req = Request(url="/api", method="POST")
print(req)                      # Output: Request(method='POST', url='/api')


# ============================================================
#  📌 RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Option              │ Effect                              |
# ─────────────────────────────────────────────────────────────
# | @dataclass          │ auto __init__, __repr__, __eq__     |
# | frozen=True         │ immutable + hashable                |
# | order=True          │ __lt__, __le__, __gt__, __ge__      |
# | slots=True          │ no __dict__, faster access (3.10+)  |
# | kw_only=True        │ all fields keyword-only (3.10+)     |
# | match_args=True     │ pattern-matching support (3.10+)    |
# | unsafe_hash=True    │ force __hash__ (careful)            |
# ─────────────────────────────────────────────────────────────
# | field() option      │ Meaning                             |
# ─────────────────────────────────────────────────────────────
# | default=...         │ fixed default value                 |
# | default_factory=... │ per-instance default (mutable)      |
# | init=False          │ not in __init__ (set in post_init)  |
# | repr=False          │ hidden from __repr__                |
# | compare=False       │ excluded from __eq__ / order        |
# | metadata={...}      │ arbitrary framework metadata        |
# ─────────────────────────────────────────────────────────────
# | Pitfall                  │ Why it bites                    |
# ─────────────────────────────────────────────────────────────
# | Mutable default          │ ValueError at class creation    |
# | Non-default after default│ TypeError at class creation     |
# | frozen + list field      │ Inner list still mutable        |
# | slots + cached_property  │ No __dict__ → TypeError         |
# | Subclass __post_init__   │ Parent's not auto-called        |
# | No runtime validation    │ Bad types pass silently         |
# ─────────────────────────────────────────────────────────────
#
# 🧠 BEST PRACTICES
#  - Reach for @dataclass whenever a class is 80%+ data.
#  - Use default_factory for any mutable default.
#  - Prefer frozen=True for value objects / configs / keys.
#  - Use order=True only when comparison is obvious.
#  - Use slots=True for high-volume small objects (3.10+).
#  - Validate and normalise in __post_init__.
#  - Exclude audit/display fields with compare=False.
#  - Choose NamedTuple for immutable tuples; Pydantic for parsing.
#  - Remember: dataclass ≠ validator; bad data still gets in.
# ============================================================