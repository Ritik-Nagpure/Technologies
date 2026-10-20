# 03_Inheritance.py

# ============================================================
#  📘 INHERITANCE IN PYTHON — COMPLETE COVERAGE
#
#  Inheritance lets a class (child / subclass) reuse and extend
#  the behaviour of another class (parent / superclass). It is
#  one of the four pillars of OOP and the foundation for code
#  reuse, polymorphism, and frameworks. Python supports single,
#  multiple, and multilevel inheritance, with a well-defined
#  Method Resolution Order (MRO) driven by the C3 algorithm.
#
#  This file covers: basic inheritance, super(), method
#  overriding, isinstance/issubclass, abstract-ish patterns,
#  cooperative multiple inheritance basics, and pitfalls like
#  the diamond problem and fragile base classes.
#
#  Sections:
#   1. What inheritance is (and when to use it)
#   2. Basic single inheritance
#   3. super() and the constructor chain
#   4. Overriding methods
#   5. isinstance and issubclass
#   6. Extending vs replacing behaviour
#   7. Multilevel and hierarchical inheritance
#   8. Edge cases, pitfalls, version notes
# ============================================================


# ============================================================
#  1️⃣ WHAT INHERITANCE IS (AND WHEN TO USE IT)
# ============================================================
# 🔹 Inheritance models an "is-a" relationship.
# 🔹 Child class inherits attributes and methods from parent.
# 🔸 Use it for real specialisation, not just to reuse code.
# 🎯 Goal: express shared behaviour once, specialise where needed.

# ❌ Without inheritance — duplicated attributes/behaviour
class DogNoInherit:
    def __init__(self, name: str) -> None:
        self.name = name
    def speak(self) -> str:
        return f"{self.name} barks"

class CatNoInherit:
    def __init__(self, name: str) -> None:
        self.name = name
    def speak(self) -> str:
        return f"{self.name} meows"

# ✅ With inheritance — shared parts in one base
class Animal:
    def __init__(self, name: str) -> None:
        self.name = name

    def speak(self) -> str:
        return f"{self.name} makes a sound"

class Dog(Animal):
    def speak(self) -> str:
        return f"{self.name} barks"

class Cat(Animal):
    def speak(self) -> str:
        return f"{self.name} meows"

# 🧠 "Prefer composition over inheritance" — inherit only when
#    the child truly IS-A kind of the parent.


# ============================================================
#  2️⃣ BASIC SINGLE INHERITANCE
# ============================================================
# 🔹 Syntax: `class Child(Parent):`
# 🔸 Child gets ALL public and protected attributes and methods.
# 🔸 Child can add new methods and attributes freely.

class Vehicle:
    wheels = 4                  # inherited class attribute

    def __init__(self, brand: str) -> None:
        self.brand = brand

    def describe(self) -> str:
        return f"{self.brand} with {self.wheels} wheels"

class Car(Vehicle):
    def honk(self) -> str:
        return "Beep!"

c = Car("Toyota")
print(c.describe())             # Output: Toyota with 4 wheels
print(c.honk())                 # Output: Beep!
print(c.wheels)                 # Output: 4
print(Car.wheels)               # Output: 4

# ✅ Child sees parent's methods as if they were its own
print(isinstance(c, Vehicle))   # Output: True
print(issubclass(Car, Vehicle)) # Output: True

# ⚠️ Changing a class attribute on the parent affects all children
#    that have not shadowed it.
Vehicle.wheels = 6
print(Car.wheels)               # Output: 6


# ============================================================
#  3️⃣ super() AND THE CONSTRUCTOR CHAIN
# ============================================================
# 🔹 super() returns a proxy to the next class in the MRO.
# 🔸 Use it to call parent methods, especially __init__.
# 🔎 In Python 3, `super()` takes no arguments.

class Person:
    def __init__(self, name: str, age: int) -> None:
        self.name = name
        self.age = age

    def info(self) -> str:
        return f"{self.name} ({self.age})"

class Employee(Person):
    def __init__(self, name: str, age: int, role: str) -> None:
        super().__init__(name, age)         # 🔸 call parent __init__
        self.role = role

    def info(self) -> str:
        base = super().info()               # 🔸 extend, don't repeat
        return f"{base} — {self.role}"

e = Employee("Ravi", 30, "Engineer")
print(e.info())                 # Output: Ravi (30) — Engineer

# ⚠️ Forgetting super().__init__ leaves parent attributes unset
class Broken(Employee):
    def __init__(self, name: str, age: int, role: str) -> None:
        self.role = role        # ❌ never called super().__init__
        # name and age never set → AttributeError on access

# b = Broken("X", 1, "Y")
# print(b.name)                 # ❌ AttributeError

# 🧠 Rule: if the parent has __init__, ALWAYS call super().__init__()
#    from the child — unless you have a deliberate reason not to.


# ============================================================
#  4️⃣ OVERRIDING METHODS
# ============================================================
# 🔹 Child redefines a method → its version wins for child instances.
# 🔸 Use super() to reuse the parent's version inside the override.

class Shape:
    def area(self) -> float:
        raise NotImplementedError("Subclass must implement area")

    def describe(self) -> str:
        return f"{self.__class__.__name__} area={self.area()}"

class Rectangle(Shape):
    def __init__(self, w: float, h: float) -> None:
        self.w = w
        self.h = h

    def area(self) -> float:            # override
        return self.w * self.h

class Square(Rectangle):
    def __init__(self, s: float) -> None:
        super().__init__(s, s)

    def describe(self) -> str:          # further override
        return f"Square side={self.w} area={self.area()}"

print(Rectangle(3, 4).describe())       # Output: Rectangle area=12
print(Square(5).describe())             # Output: Square side=5 area=25

# ⚠️ Overriding a method with a DIFFERENT signature breaks Liskov
#    Substitution — external code calling the parent API may fail.
# 🧠 Overrides should accept at least what the parent accepted and
#    return the same type (or a subtype).


# ============================================================
#  5️⃣ isinstance AND issubclass
# ============================================================
# 🔹 isinstance(obj, Cls) → True if obj is an instance of Cls
#                          OR any subclass of Cls.
# 🔹 issubclass(Sub, Base) → True if Sub is Base or inherits Base.
# 🔸 Both accept tuples for multiple checks.

print(isinstance(Square(2), Rectangle))     # Output: True
print(isinstance(Square(2), Shape))         # Output: True
print(isinstance(Square(2), object))        # Output: True
print(isinstance(5, int))                   # Output: True

print(issubclass(Square, Shape))            # Output: True
print(issubclass(Shape, Square))            # Output: False

print(isinstance(5, (int, str)))            # Output: True

# ⚠️ type(x) is Cls does NOT respect inheritance.
print(type(Square(2)) is Rectangle)         # Output: False
print(type(Square(2)) is Square)            # Output: True

# 🧠 Prefer isinstance() in conditionals — it handles subclasses.
#    Use type() only for exact-type equality checks.


# ============================================================
#  6️⃣ EXTENDING VS REPLACING BEHAVIOUR
# ============================================================
# 🔹 REPLACE : child defines its own version → parent's is hidden.
# 🔹 EXTEND  : child calls super().m() then adds more.
# 🔸 Extending is safer — preserves parent invariants.

class Logger:
    def log(self, msg: str) -> None:
        print(f"[LOG] {msg}")

class TimestampLogger(Logger):
    def log(self, msg: str) -> None:
        import time
        super().log(f"{time.strftime('%H:%M:%S')} {msg}")   # extend

class SilentLogger(Logger):
    def log(self, msg: str) -> None:
        pass                    # replace — do nothing

TimestampLogger().log("hello")  # Output: [LOG] HH:MM:SS hello
SilentLogger().log("hi")        # Output: (nothing)

# 🧠 Prefer extending (super + add) over replacing when the parent
#    has important side effects or validation.


# ============================================================
#  7️⃣ MULTILEVEL AND HIERARCHICAL INHERITANCE
# ============================================================
# 🔹 Multilevel: A → B → C (chain).
# 🔹 Hierarchical: one parent → many children.
# 🔸 Both are common and safe. Watch out for deep chains.

class A:
    def who(self) -> str: return "A"

class B(A):
    def who(self) -> str: return "B -> " + super().who()

class C(B):
    def who(self) -> str: return "C -> " + super().who()

print(C().who())                # Output: C -> B -> A

# 🔎 MRO (Method Resolution Order) — Python computes a linear order
#    using the C3 algorithm; super() follows that order.
print([k.__name__ for k in C.mro()])
# Output: ['C', 'B', 'A', 'object']

# ⚠️ Deep chains (5+ levels) become hard to reason about.
# 🧠 Keep hierarchies shallow. Two to three levels is usually enough.


# ============================================================
#  8️⃣ EDGE CASES, PITFALLS, VERSION NOTES
# ============================================================
# ⚠️ Diamond problem: if two parents share a base, MRO decides
#    which one runs — see 09 for the full treatment.
# ⚠️ Fragile base class: changing a parent method can silently
#    break children that extend it.
# ⚠️ Subclassing built-ins (list, dict) is allowed but easy to
#    get wrong — many methods don't call each other as you expect.

class MyList(list):
    def add_twice(self, x: int) -> None:
        self.append(x)
        self.append(x)

ml = MyList([1, 2])
ml.add_twice(3)
print(ml)                       # Output: [1, 2, 3, 3]

# ⚠️ Prefer composition (holding a list inside a class) over
#    subclassing built-ins unless you truly need to.
# 🧠 isinstance(True, int) is True — bool subclasses int!

print(isinstance(True, int))    # Output: True
print(True + True)              # Output: 2

# 🕒 Version notes
# - Classic vs new-style classes unified: Python 3.0+
# - Zero-arg super(): Python 3.0+
# - `__init_subclass__` hook for customising subclass creation: 3.6+
# - `__class_getitem__` for generic subscripting: 3.7+
# - `object` explicit inheritance no longer needed: Python 3.0+
# - ABCs and `@abstractmethod` (see file 05): Python 2.6+ / 3.0+

# 🔎 __init_subclass__ example
class Registry:
    registry: dict[str, type] = {}

    def __init_subclass__(cls, **kwargs: object) -> None:
        super().__init_subclass__(**kwargs)
        Registry.registry[cls.__name__] = cls

class PluginA(Registry): pass
class PluginB(Registry): pass

print(list(Registry.registry))  # Output: ['PluginA', 'PluginB']


# ============================================================
#  📌 RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Concept              │ Syntax / Notes                    |
# ─────────────────────────────────────────────────────────────
# | Single inheritance   │ class Child(Parent): ...          |
# | Multiple inheritance │ class C(A, B): ...                |
# | Call parent method   │ super().method(...)               |
# | Call parent __init__ │ super().__init__(...)             |
# | Override method      │ redefine with same name           |
# | Extend method        │ super().m() + extra logic         |
# | Is-instance check    │ isinstance(obj, Cls)              |
# | Is-subclass check    │ issubclass(Sub, Base)             |
# | MRO                  │ Cls.mro()  /  Cls.__mro__         |
# ─────────────────────────────────────────────────────────────
# | Pitfall              │ Why it bites                      |
# ─────────────────────────────────────────────────────────────
# | No super().__init__  │ Parent attrs never set            |
# | type() vs isinstance │ type ignores subclassing          |
# | Subclassing list/dict│ Unexpected method dispatch        |
# | Deep chains          │ Hard to trace behaviour           |
# | LSP violation        │ Child breaks parent's contract    |
# | isinstance(True,int) │ bool is int subclass              |
# ─────────────────────────────────────────────────────────────
#
# 🧠 BEST PRACTICES
#  - Inherit only for "is-a" relationships — otherwise compose.
#  - Always call super().__init__() from a child __init__.
#  - Extend parent behaviour instead of replacing it outright.
#  - Prefer isinstance() over type() checks.
#  - Keep hierarchies shallow (2–3 levels max).
#  - Document method contracts so overrides stay compatible.
#  - Reach for abstract base classes (file 05) to enforce overrides.
# ============================================================