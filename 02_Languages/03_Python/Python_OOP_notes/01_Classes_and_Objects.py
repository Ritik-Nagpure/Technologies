# 01_Classes_and_Objects.py

# ============================================================
#  📘 CLASSES & OBJECTS IN PYTHON — COMPLETE COVERAGE
#
#  A CLASS is a user-defined blueprint that bundles data
#  (attributes) and behaviour (methods) into one unit. An OBJECT
#  is a concrete instance built from that blueprint. Everything
#  in Python — ints, strings, functions, even classes — is an
#  object, so understanding class/object mechanics is the
#  foundation for every other OOP concept.
#
#  This file covers: what a class is, how objects are created,
#  __init__ and self, instance vs class attributes, dynamic
#  attribute access, and the pitfalls beginners hit first.
#
#  Sections:
#   1. Class vs Object — the mental model
#   2. Defining a class
#   3. Creating objects (instances)
#   4. __init__ and self
#   5. Instance vs class attributes
#   6. Dynamic attribute access
#   7. Inspecting objects
#   8. Edge cases, pitfalls, version notes
# ============================================================


# ============================================================
#  1️⃣ CLASS VS OBJECT — THE MENTAL MODEL
# ============================================================
# 🔹 A class is a BLUEPRINT. An object is a HOUSE built from it.
# 🔹 You can build many houses from one blueprint.
# 🔸 Each house has its own rooms (data) but the same layout.
# 🎯 Goal: bundle related data + behaviour so code stays coherent.

# ❌ Without OOP — data and behaviour drift apart
dog1_name, dog1_age = "Rex", 3
dog2_name, dog2_age = "Bella", 5

def bark(name: str) -> str:
    return f"{name} says Woof!"

print(bark(dog1_name))          # Output: Rex says Woof!

# ✅ With OOP — data + behaviour live together
class Dog:
    def __init__(self, name: str, age: int) -> None:
        self.name = name
        self.age = age

    def bark(self) -> str:
        return f"{self.name} says Woof!"

# 🧠 Rule of thumb: if two things always travel together, they
#    probably belong in the same class.


# ============================================================
#  2️⃣ DEFINING A CLASS
# ============================================================
# 🔹 Syntax: `class Name:` — CapWords (PascalCase) by convention.
# 🔸 Body can be empty using `pass`.
# 🔸 Classes themselves are objects (instances of `type`).

class Empty:
    pass

print(type(Empty))              # Output: <class 'type'>
print(type(Dog))                # Output: <class 'type'>

# ⚠️ Class names must be valid identifiers; keyword names (class,
#    def, return) cannot be used.
# class class: pass             # ❌ SyntaxError

# 🧠 One class = one responsibility. Avoid "god classes".


# ============================================================
#  3️⃣ CREATING OBJECTS (INSTANCES)
# ============================================================
# 🔹 Call the class like a function: `obj = ClassName(args)`.
# 🔸 Each call produces a NEW, independent object.

rex = Dog("Rex", 3)
bella = Dog("Bella", 5)

print(rex.bark())               # Output: Rex says Woof!
print(bella.bark())             # Output: Bella says Woof!

# ✅ Objects are independent
rex.age = 4
print(rex.age, bella.age)       # Output: 4 5

# ⚠️ Forgetting parentheses returns the CLASS, not an object
not_a_dog = Dog
print(type(not_a_dog))          # Output: <class 'type'>
# print(not_a_dog.bark())       # ❌ TypeError: bark() missing self


# ============================================================
#  4️⃣ __init__ AND SELF
# ============================================================
# 🔹 __init__ is the initializer, run automatically after creation.
# 🔹 self is the reference to the CURRENT instance.
# 🔸 Python passes the instance as the first argument automatically.
# 🔎 __new__ actually creates the object; __init__ initializes it.

class Student:
    def __init__(self, name: str, grade: int) -> None:
        self.name = name
        self.grade = grade

    def promote(self) -> None:
        self.grade += 1

s = Student("Ravi", 10)
print(s.name, s.grade)          # Output: Ravi 10
s.promote()
print(s.grade)                  # Output: 11

# ✅ Explicit self in the definition; implicit at the call site
# ⚠️ Forgetting self in the definition raises TypeError
# class Cat:
#     def meow():               # ❌ missing self
#         return "Meow"
# Cat().meow()                  # ❌ TypeError

# ⚠️ __init__ must return None
# class Bad:
#     def __init__(self):
#         return 42             # ❌ TypeError: __init__() should return None


# ============================================================
#  5️⃣ INSTANCE VS CLASS ATTRIBUTES
# ============================================================
# 🔹 Instance attribute: defined on `self`, unique per object.
# 🔹 Class attribute   : defined in the class body, shared.
# 🔸 Lookup order      : instance → class → base classes.

class Account:
    bank = "SBI"                # class attribute (shared)

    def __init__(self, owner: str) -> None:
        self.owner = owner      # instance attribute

a1 = Account("Ravi")
a2 = Account("Meera")

print(a1.bank, a2.bank)         # Output: SBI SBI

Account.bank = "HDFC"           # change for ALL
print(a1.bank, a2.bank)         # Output: HDFC HDFC

a1.bank = "ICICI"               # shadows only a1
print(a1.bank, a2.bank)         # Output: ICICI HDFC

# ⚠️ Mutable class attributes are shared by every instance
class Bad:
    tricks: list[str] = []

b1, b2 = Bad(), Bad()
b1.tricks.append("roll")
print(b2.tricks)                # Output: ['roll']  ← surprising!

# ✅ Fix: initialize mutable state inside __init__
class Good:
    def __init__(self) -> None:
        self.tricks: list[str] = []

g1, g2 = Good(), Good()
g1.tricks.append("sit")
print(g2.tricks)                # Output: []

# 🧠 Rule: never put mutable defaults on the class body for
#    per-object state. Put them on self in __init__.


# ============================================================
#  6️⃣ DYNAMIC ATTRIBUTE ACCESS
# ============================================================
# 🔹 hasattr / getattr / setattr / delattr — runtime access.
# 🔸 getattr with default avoids AttributeError.

print(hasattr(a1, "owner"))             # Output: True
print(getattr(a1, "owner"))             # Output: Ravi
print(getattr(a1, "nickname", "N/A"))   # Output: N/A

setattr(a1, "nickname", "Rav")          # add attribute at runtime
print(a1.nickname)                      # Output: Rav

delattr(a1, "nickname")
print(hasattr(a1, "nickname"))          # Output: False

# ⚠️ Typos in attribute names silently create new attributes when
#    you use setattr or direct assignment — Python won't complain.
a1.onwer = "typo"                       # ✅ allowed (but wrong name!)
print(a1.onwer)                         # Output: typo

# 🧠 For strict schemas, prefer __slots__ or dataclasses.


# ============================================================
#  7️⃣ INSPECTING OBJECTS
# ============================================================
# 🔹 type()        → the class of the object
# 🔹 isinstance()  → is it an instance of a class (or subclass)?
# 🔹 id()          → unique identity (memory address)
# 🔹 vars(obj)     → instance __dict__ as a mapping
# 🔹 dir(obj)      → all attributes/methods (including inherited)

print(type(rex))                        # Output: <class '__main__.Dog'>
print(isinstance(rex, Dog))             # Output: True
print(isinstance(rex, object))          # Output: True
print(id(rex) == id(bella))             # Output: False
print(vars(rex))                        # Output: {'name': 'Rex', 'age': 3}
print("bark" in dir(rex))               # Output: True

# 🔎 isinstance vs type: isinstance respects inheritance; type does not.
class Puppy(Dog):
    pass

p = Puppy("Rex Jr", 1)
print(isinstance(p, Dog))               # Output: True
print(type(p) is Dog)                   # Output: False

# 🧠 Prefer isinstance() in conditionals; use type() only for exact
#    type checks when you truly mean "this exact class".


# ============================================================
#  8️⃣ EDGE CASES, PITFALLS, VERSION NOTES
# ============================================================
# ⚠️ Every class implicitly inherits from `object`.
# ⚠️ Classes can be modified at runtime — but doing so is fragile.
# ⚠️ Deleting an instance attribute then accessing it raises
#    AttributeError.
# del rex.name
# print(rex.name)                # ❌ AttributeError

# ⚠️ `is` compares identity, `==` compares value.
print(rex is bella)              # Output: False
print(rex == bella)              # Output: False  (default __eq__ = identity)

# ⚠️ Two identical-looking objects are still distinct by default.
x, y = Dog("Rex", 3), Dog("Rex", 3)
print(x == y)                    # Output: False (no custom __eq__)

# 🕒 Version notes
# - New-style classes (all classes inherit from object): Python 2.2+
# - `object` explicit inheritance no longer required: Python 3.0+
# - `super()` with no arguments: Python 3.0+
# - `__init_subclass__` hook: Python 3.6+
# - `@dataclass` decorator: Python 3.7+
# - `__set_name__` for descriptors: Python 3.6+


# ============================================================
#  📌 RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Concept             │ Syntax / Notes                      |
# ─────────────────────────────────────────────────────────────
# | Define class        │ class Name: ...                     |
# | Create object       │ obj = Name(args)                    |
# | Initializer         │ def __init__(self, ...): ...        |
# | Instance attr       │ self.x = value                      |
# | Class attr          │ x = value  (class body)             |
# | Instance method     │ def m(self): ...                    |
# | Inspect class       │ type(obj) / obj.__class__           |
# | Inspect instance    │ isinstance(obj, Cls)                |
# | Runtime attrs       │ hasattr/getattr/setattr/delattr     |
# | Attribute dict      │ vars(obj) / obj.__dict__            |
# ─────────────────────────────────────────────────────────────
# | Pitfall             │ Why it bites                        |
# ─────────────────────────────────────────────────────────────
# | Mutable class attr  │ Shared across ALL instances         |
# | Missing self        │ TypeError on method call            |
# | __init__ returns x  │ TypeError on object creation        |
# | type() vs isinstance│ type ignores inheritance            |
# | Attribute typo      │ Silently creates a new attribute    |
# ─────────────────────────────────────────────────────────────
#
# 🧠 BEST PRACTICES
#  - One class = one responsibility.
#  - Use CapWords for class names, snake_case for methods/attrs.
#  - Initialize mutable state inside __init__, never on the class body.
#  - Prefer isinstance() over type() in conditionals.
#  - Always define __repr__ for anything you will debug (see 06).
#  - Keep __init__ small — validate and assign, don't do heavy work.
# ============================================================