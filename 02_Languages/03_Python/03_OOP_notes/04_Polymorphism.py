# 04_Polymorphism.py

# ============================================================
#  📘 POLYMORPHISM IN PYTHON — COMPLETE COVERAGE
#
#  Polymorphism ("many forms") is the ability of different
#  objects to respond to the SAME method call in their own way.
#  Python supports it through method overriding, duck typing,
#  operator overloading, and protocols — no explicit interface
#  keyword required.
#
#  This file covers: duck typing, method overriding as
#  polymorphism, operator overloading via dunder methods,
#  protocols (typing.Protocol), functools.singledispatch for
#  ad-hoc polymorphism, and the pitfalls of loose typing.
#
#  Sections:
#   1. What polymorphism is
#   2. Method overriding polymorphism
#   3. Duck typing
#   4. Operator overloading
#   5. Polymorphism via inheritance + super()
#   6. Protocols (structural typing)
#   7. functools.singledispatch (function overloading)
#   8. Edge cases, pitfalls, version notes
# ============================================================


# ============================================================
#  1️⃣ WHAT POLYMORPHISM IS
# ============================================================
# 🔹 Same interface, different implementations.
# 🔹 Caller does not care WHAT the object is — only what it can DO.
# 🎯 Goal: write code once against a common interface; swap
#    implementations freely.
# 🔸 Three flavours in Python:
#      • Overriding (inheritance-based)
#      • Duck typing (structural)
#      • Operator overloading (dunder methods)

# ❌ Without polymorphism — branching on type
def area_bad(shape: object) -> float:
    if shape.__class__.__name__ == "Circle":
        return 3.14159 * shape.r ** 2
    elif shape.__class__.__name__ == "Square":
        return shape.s ** 2
    raise TypeError("Unknown shape")

# ✅ With polymorphism — call shape.area() and let it decide
class Shape:
    def area(self) -> float:
        raise NotImplementedError

class Circle(Shape):
    def __init__(self, r: float) -> None: self.r = r
    def area(self) -> float: return 3.14159 * self.r ** 2

class Square(Shape):
    def __init__(self, s: float) -> None: self.s = s
    def area(self) -> float: return self.s ** 2

for shp in (Circle(5), Square(4)):
    print(f"{type(shp).__name__}: {shp.area():.2f}")
# Output: Circle: 78.54
# Output: Square: 16.00

# 🧠 Polymorphism means adding a new shape does NOT require
#    editing this loop — Open/Closed Principle in action.


# ============================================================
#  2️⃣ METHOD OVERRIDING POLYMORPHISM
# ============================================================
# 🔹 Subclass provides its own version of a parent method.
# 🔸 Python dispatches at RUNTIME based on the object's class.

class Animal:
    def speak(self) -> str:
        return "..."

class Dog(Animal):
    def speak(self) -> str:
        return "Woof"

class Cat(Animal):
    def speak(self) -> str:
        return "Meow"

class Cow(Animal):
    def speak(self) -> str:
        return "Moo"

animals: list[Animal] = [Dog(), Cat(), Cow(), Animal()]
for a in animals:
    print(a.speak())
# Output: Woof
# Output: Meow
# Output: Moo
# Output: ...

# ✅ Same call `a.speak()` — different behaviour per class.
# 🔎 This is also called "subtype polymorphism".


# ============================================================
#  3️⃣ DUCK TYPING
# ============================================================
# 🔹 "If it walks like a duck and quacks like a duck, it's a duck."
# 🔸 Python does NOT check the type — it checks the METHOD exists.
# 🎯 Enables polymorphism without inheritance.

class Robot:
    def speak(self) -> str:
        return "Beep boop"

class Parrot:
    def speak(self) -> str:
        return "Polly wants a cracker"

def make_it_speak(entity: object) -> None:
    # ✅ Structural check at runtime
    if hasattr(entity, "speak"):
        print(entity.speak())
    else:
        print(f"{type(entity).__name__} cannot speak")

make_it_speak(Dog())            # Output: Woof
make_it_speak(Robot())          # Output: Beep boop
make_it_speak(Parrot())         # Output: Polly wants a cracker
make_it_speak(42)               # Output: int cannot speak

# ⚠️ Duck typing is flexible but unchecked — a typo (`.speek`)
#    silently falls back to "cannot speak".
# 🧠 For safety, combine duck typing with Protocol (section 6).


# ============================================================
#  4️⃣ OPERATOR OVERLOADING
# ============================================================
# 🔹 Dunder methods let YOUR objects respond to +, -, ==, <, len.
# 🔸 This is polymorphism at the syntax level.

class Vector:
    def __init__(self, x: float, y: float) -> None:
        self.x, self.y = x, y

    def __add__(self, other: "Vector") -> "Vector":
        return Vector(self.x + other.x, self.y + other.y)

    def __sub__(self, other: "Vector") -> "Vector":
        return Vector(self.x - other.x, self.y - other.y)

    def __mul__(self, k: float) -> "Vector":
        return Vector(self.x * k, self.y * k)

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Vector):
            return NotImplemented
        return (self.x, self.y) == (other.x, other.y)

    def __repr__(self) -> str:
        return f"Vector({self.x}, {self.y})"

v1, v2 = Vector(1, 2), Vector(3, 4)
print(v1 + v2)                  # Output: Vector(4, 6)
print(v2 - v1)                  # Output: Vector(2, 2)
print(v1 * 3)                   # Output: Vector(3, 6)
print(v1 == Vector(1, 2))       # Output: True
print(2 * v1)                   # ❌ TypeError unless __rmul__ defined

# ✅ Add __rmul__ for right-hand multiplication
class Vector2(Vector):
    def __rmul__(self, k: float) -> "Vector2":
        return Vector2(self.x * k, self.y * k)

print(2 * Vector2(1, 2))        # Output: Vector(2, 4)

# ⚠️ Returning NotImplemented (not raising) lets Python try the
#    OTHER operand's method — required for correct dispatch.
# 🧠 Only overload operators when the meaning is obvious to the
#    reader. Don't overload + to mean "send email".


# ============================================================
#  5️⃣ POLYMORPHISM VIA INHERITANCE + SUPER
# ============================================================
# 🔹 Child can extend a parent method and still be called the
#    same way — caller sees one consistent interface.

class Exporter:
    def export(self, data: dict[str, object]) -> str:
        return "\n".join(f"{k}={v}" for k, v in data.items())

class JsonExporter(Exporter):
    def export(self, data: dict[str, object]) -> str:
        import json
        return json.dumps(data)

class CsvExporter(Exporter):
    def export(self, data: dict[str, object]) -> str:
        return ",".join(map(str, data.values()))

def save(exp: Exporter, data: dict[str, object]) -> None:
    print(exp.export(data))         # ← polymorphic call

save(Exporter(), {"a": 1, "b": 2})
# Output: a=1
#         b=2

save(JsonExporter(), {"a": 1, "b": 2})
# Output: {"a": 1, "b": 2}

save(CsvExporter(), {"a": 1, "b": 2})
# Output: 1,2

# 🧠 save() doesn't know or care WHICH exporter it got — this is
#    the whole point of polymorphism.


# ============================================================
#  6️⃣ PROTOCOLS (STRUCTURAL TYPING)
# ============================================================
# 🔹 typing.Protocol defines an interface by SHAPE, not by name.
# 🔸 Any class with matching methods satisfies the protocol.
# 🎯 Best of duck typing + static checking (mypy/pyright).

from typing import Protocol

class Speaker(Protocol):
    def speak(self) -> str: ...

class Human:
    def speak(self) -> str:
        return "Hello"

class Alien:
    def speak(self) -> str:
        return "Zorblax"

def announce(s: Speaker) -> None:
    print(s.speak())

announce(Human())               # Output: Hello
announce(Alien())               # Output: Zorblax
# announce(42)                  # ❌ type-checker error (mypy)

# ⚠️ Protocol only works at TYPE-CHECK time — runtime does not
#    enforce it (unless you use @runtime_checkable).
from typing import runtime_checkable

@runtime_checkable
class Named(Protocol):
    name: str

class Person:
    def __init__(self, name: str) -> None:
        self.name = name

print(isinstance(Person("Ravi"), Named))    # Output: True
print(isinstance(42, Named))                # Output: False

# 🧠 Protocols give you duck typing with IDE/type-checker safety.


# ============================================================
#  7️⃣ functools.singledispatch (FUNCTION OVERLOADING)
# ============================================================
# 🔹 Ad-hoc polymorphism: ONE function name, MANY type-specific
#    implementations chosen at runtime by the first argument's type.
# 🔸 Closest thing to C++/Java overloading in Python.

from functools import singledispatch

@singledispatch
def render(x: object) -> str:
    return f"unknown: {x!r}"

@render.register
def _(x: int) -> str:
    return f"int: {x}"

@render.register
def _(x: str) -> str:
    return f"str: {x!r}"

@render.register
def _(x: list) -> str:
    return f"list of {len(x)} items"

print(render(10))               # Output: int: 10
print(render("hi"))             # Output: str: 'hi'
print(render([1, 2, 3]))        # Output: list of 3 items
print(render(3.14))             # Output: unknown: 3.14

# ⚠️ Dispatch is on the FIRST argument only.
# ⚠️ Subclasses are matched by MRO — nearest registered wins.
# 🧠 Use singledispatch instead of long if/elif isinstance chains.


# ============================================================
#  8️⃣ EDGE CASES, PITFALLS, VERSION NOTES
# ============================================================
# ⚠️ Duck typing hides typos: `hasattr(obj, "speek")` = False,
#    silently skipping your intended branch.
# ⚠️ Returning None from a dunder like __add__ breaks chaining.
# ⚠️ Operator overloading with wrong semantics confuses readers.
# ⚠️ singledispatch does not dispatch on keyword arguments.
# ⚠️ Protocols do NOT enforce runtime structure unless decorated.
# ⚠️ bool is a subclass of int → `render(True)` hits the int
#    implementation unexpectedly.

print(render(True))             # Output: int: True

# 🕒 Version notes
# - Duck typing: from the start (Python 2.x)
# - typing.Protocol: Python 3.8+
# - runtime_checkable: Python 3.8+
# - functools.singledispatch: Python 3.4+
# - singledispatchmethod (methods): Python 3.8+
# - ParamSpec / structural generics: Python 3.10+
# - PEP 544 (Protocols) formalised: Python 3.8

# 🔎 singledispatchmethod example
class Formatter:
    @singledispatch
    def fmt(self, x: object) -> str:
        return repr(x)

    @fmt.register
    def _(self, x: int) -> str:
        return f"#{x:04d}"

    @fmt.register
    def _(self, x: str) -> str:
        return x.upper()

f = Formatter()
print(f.fmt(42))                # Output: #0042
print(f.fmt("hi"))              # Output: HI
print(f.fmt([1, 2]))            # Output: [1, 2]


# ============================================================
#  📌 RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Kind of polymorphism │ Mechanism / Notes                 |
# ─────────────────────────────────────────────────────────────
# | Subtype              │ Method overriding + inheritance   |
# | Duck typing          │ hasattr / try-except              |
# | Operator overloading │ __add__, __eq__, __len__, etc.    |
# | Structural           │ typing.Protocol                   |
# | Ad-hoc               │ functools.singledispatch          |
# ─────────────────────────────────────────────────────────────
# | Dunder               │ Enables                           |
# ─────────────────────────────────────────────────────────────
# | __add__ / __radd__   │ a + b, b + a                      |
# | __sub__ / __mul__    │ a - b, a * b                      |
# | __eq__ / __ne__      │ ==, !=                            |
# | __lt__ / __gt__      │ <, >                              |
# | __len__              │ len(a)                            |
# | __getitem__          │ a[i]                              |
# | __call__             │ a(...)                            |
# ─────────────────────────────────────────────────────────────
# | Pitfall              │ Why it bites                      |
# ─────────────────────────────────────────────────────────────
# | Typo in method name  │ Duck typing silently skips        |
# | No __rmul__          │ `2 * vec` fails                   |
# | Not returning NotImp.│ Wrong side never gets a chance    |
# | bool is int subclass │ `True` dispatches as int          |
# | Loose operators      │ `+` meaning "send email" = chaos  |
# ─────────────────────────────────────────────────────────────
#
# 🧠 BEST PRACTICES
#  - Design around a small, stable interface (one or two methods).
#  - Prefer polymorphism over isinstance/if-elif chains.
#  - Use Protocol + type hints for safe duck typing.
#  - Overload operators only when meaning is obvious.
#  - Return NotImplemented (not False/None) from dunders on
#    type mismatch.
#  - Use functools.singledispatch instead of long type branches.
#  - Remember bool is an int subclass — order your checks.
# ============================================================