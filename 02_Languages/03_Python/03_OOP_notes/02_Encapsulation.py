# 02_Encapsulation.py

# ============================================================
#  📘 ENCAPSULATION IN PYTHON — COMPLETE COVERAGE
#
#  Encapsulation is the OOP principle of bundling data and the
#  methods that operate on it into a single unit, while
#  controlling how the outside world can read or change that
#  data. Python has no true `private` keyword — instead it uses
#  naming conventions (single underscore, double underscore) and
#  `@property` to enforce access patterns at the API level.
#
#  This file covers: public/protected/private naming, name
#  mangling, @property getters/setters/deleters, validation,
#  read-only attributes, and the pitfalls of fake-privacy.
#
#  Sections:
#   1. What encapsulation means in Python
#   2. Public, protected, private conventions
#   3. Name mangling (__attr)
#   4. @property — computed and validated access
#   5. Setters and deleters
#   6. Read-only and write-only attributes
#   7. __slots__ for tighter encapsulation
#   8. Edge cases, pitfalls, version notes
# ============================================================


# ============================================================
#  1️⃣ WHAT ENCAPSULATION MEANS IN PYTHON
# ============================================================
# 🔹 Encapsulation = data + behaviour together + controlled access.
# 🔹 Python's philosophy: "we're all consenting adults here."
# 🔸 So privacy is by CONVENTION, not enforcement.
# 🎯 Goal: prevent accidental corruption, allow safe refactors.

# ❌ Naive class — anyone can set nonsense
class BadAccount:
    def __init__(self, balance: float) -> None:
        self.balance = balance

a = BadAccount(100)
a.balance = -9999               # ✅ allowed — but logically wrong
print(a.balance)                # Output: -9999

# ✅ Encapsulated class — access is guarded
class GoodAccount:
    def __init__(self, balance: float) -> None:
        self._balance = balance

    def deposit(self, amount: float) -> None:
        if amount <= 0:
            raise ValueError("Deposit must be positive")
        self._balance += amount

    def get_balance(self) -> float:
        return self._balance

g = GoodAccount(100)
g.deposit(50)
print(g.get_balance())          # Output: 150

# 🧠 Encapsulation is about protecting INVARIANTS, not hiding data
#    for the sake of hiding it.


# ============================================================
#  2️⃣ PUBLIC, PROTECTED, PRIVATE CONVENTIONS
# ============================================================
# 🔹 name     → public, part of the API
# 🔹 _name    → protected, "internal use" (a hint, not enforced)
# 🔹 __name   → private, name-mangled by the interpreter
# 🔸 These are CONVENTIONS — none of them truly blocks access.

class Account:
    def __init__(self, owner: str, balance: float) -> None:
        self.owner = owner          # public
        self._balance = balance     # protected
        self.__pin = "1234"         # private (mangled)

acc = Account("Ravi", 500)

print(acc.owner)                # Output: Ravi
print(acc._balance)             # Output: 500  (works, but discouraged)

# ⚠️ Linters (pylint, ruff) will warn on _balance access from outside.
# ⚠️ __pin is NOT accessible as acc.__pin
# print(acc.__pin)              # ❌ AttributeError

# 🧠 Rule of thumb:
#    - public  : safe for anyone
#    - _single : "don't touch unless you're extending this class"
#    - __double: "name-mangling protects this from accidental override"


# ============================================================
#  3️⃣ NAME MANGLING (__attr)
# ============================================================
# 🔹 Double-underscore attributes are renamed to _ClassName__attr.
# 🔸 This is not encryption — it's a compile-time rename.
# 🔎 Purpose: prevent accidental name clashes in subclasses.

class Vault:
    def __init__(self) -> None:
        self.__secret = "gold"

v = Vault()

# print(v.__secret)             # ❌ AttributeError
print(v._Vault__secret)         # Output: gold  ← still reachable

# ⚠️ Name mangling applies to anything starting with __ and not
#    ending with __ (so __init__ is NOT mangled).

# ✅ Subclass with same-named attribute does not clash
class Parent:
    def __init__(self) -> None:
        self.__x = "parent"

class Child(Parent):
    def __init__(self) -> None:
        super().__init__()
        self.__x = "child"      # becomes _Child__x — different slot

c = Child()
print(c._Parent__x)             # Output: parent
print(c._Child__x)              # Output: child

# ⚠️ Double-underscore does NOT protect from determined access —
#    only from accidental naming collisions.
# 🧠 If you need real hiding, don't store the data on the object;
#    use a closure or module-level store (rare in Python).


# ============================================================
#  4️⃣ @PROPERTY — COMPUTED AND VALIDATED ACCESS
# ============================================================
# 🔹 @property turns a method into a readable attribute.
# 🔸 The outside world uses `obj.x` — no parentheses.
# 🎯 Enables computed values, lazy loading, and validation.

class Temperature:
    def __init__(self, celsius: float) -> None:
        self._celsius = celsius

    @property
    def celsius(self) -> float:
        return self._celsius

    @property
    def fahrenheit(self) -> float:
        # 🔸 computed — no storage
        return self._celsius * 9 / 5 + 32

t = Temperature(25)
print(t.celsius)                # Output: 25
print(t.fahrenheit)             # Output: 77.0

# ⚠️ Computed properties are read-only unless you add a setter.
# t.fahrenheit = 100            # ❌ AttributeError: can't set attribute

# 🧠 Use @property instead of get_x()/set_x() methods — it's the
#    Pythonic way, and existing call sites don't break when you
#    later add validation.


# ============================================================
#  5️⃣ SETTERS AND DELETERS
# ============================================================
# 🔹 @x.setter    → intercept assignment.
# 🔹 @x.deleter   → intercept `del obj.x`.
# 🔸 All three share the same name.

class Person:
    def __init__(self, name: str, age: int) -> None:
        self._name = name
        self._age = age

    @property
    def age(self) -> int:
        return self._age

    @age.setter
    def age(self, value: int) -> None:
        if not isinstance(value, int):
            raise TypeError("Age must be an int")
        if value < 0 or value > 150:
            raise ValueError("Age out of range")
        self._age = value

    @age.deleter
    def age(self) -> None:
        print("Deleting age")
        del self._age

p = Person("Ravi", 30)
p.age = 31                      # ✅ goes through setter
print(p.age)                    # Output: 31

# p.age = -5                    # ❌ ValueError: Age out of range
# p.age = "old"                 # ❌ TypeError: Age must be an int

del p.age                       # Output: Deleting age
# print(p.age)                  # ❌ AttributeError

# 🧠 Always validate inside the setter — never trust the caller.


# ============================================================
#  6️⃣ READ-ONLY AND WRITE-ONLY ATTRIBUTES
# ============================================================
# 🔹 Read-only: define @property, no setter.
# 🔹 Write-only: define setter, raise in getter (unusual).

class Circle:
    def __init__(self, radius: float) -> None:
        self._radius = radius

    @property
    def radius(self) -> float:
        return self._radius

    @property
    def area(self) -> float:
        return 3.14159 * self._radius ** 2

c = Circle(5)
print(c.area)                   # Output: 78.53975

# c.radius = 10                 # ❌ AttributeError — read-only
# c.area = 50                   # ❌ AttributeError — read-only

# 🔎 Write-only (rare): useful for secrets you set but never echo
class Password:
    def __init__(self) -> None:
        self._value = ""

    @property
    def value(self) -> str:
        raise AttributeError("Password is write-only")

    @value.setter
    def value(self, raw: str) -> None:
        self._value = raw

pw = Password()
pw.value = "hunter2"            # ✅ setter works
# print(pw.value)               # ❌ AttributeError: Password is write-only


# ============================================================
#  7️⃣ __slots__ FOR TIGHTER ENCAPSULATION
# ============================================================
# 🔹 __slots__ declares a fixed set of attributes.
# 🔸 Prevents accidental typos creating new attributes.
# 🔸 Slightly less memory per instance (no __dict__).

class Point:
    __slots__ = ("x", "y")

    def __init__(self, x: int, y: int) -> None:
        self.x = x
        self.y = y

pt = Point(1, 2)
print(pt.x, pt.y)               # Output: 1 2

# pt.z = 3                      # ❌ AttributeError: 'Point' object has no attribute 'z'
# pt.__dict__                   # ❌ AttributeError: no __dict__

# ⚠️ __slots__ blocks adding new attributes — good for schemas,
#    bad if you rely on dynamic attributes or multiple inheritance
#    with non-slotted parents.
# 🧠 Use __slots__ for small, fixed-shape data (points, records).
#    For flexible classes, skip it.


# ============================================================
#  8️⃣ EDGE CASES, PITFALLS, VERSION NOTES
# ============================================================
# ⚠️ A single-underscore attribute is NOT protected — only signalled.
# ⚠️ Name mangling is not security — `_Cls__attr` still works.
# ⚠️ @property replaces the class attribute; you cannot have both
#    a property and an instance attribute of the same name.
# ⚠️ Inherited setters apply to subclasses too — override carefully.
# ⚠️ Properties are looked up on the CLASS, not the instance, so
#    `self.x = ...` inside __init__ triggers the setter if defined.
#    That's usually good (validation) but can be surprising.

class Verbose:
    def __init__(self) -> None:
        self.value = 10         # 🔎 goes through the setter below

    @property
    def value(self) -> int:
        return self._value

    @value.setter
    def value(self, v: int) -> None:
        print(f"Setting value to {v}")
        self._value = v

Verbose()                       # Output: Setting value to 10

# 🕒 Version notes
# - New-style classes required for `property`: Python 2.2+
# - @property decorator syntax: Python 2.6+
# - @x.setter / @x.deleter decorators: Python 2.6+
# - __slots__ : Python 2.2+
# - __set_name__ for descriptors: Python 3.6+
# - `functools.cached_property`: Python 3.8+
# - `@property` on classmethod via stacking: Python 3.9+ (still unusual)
#   Python 3.10+ better via `classmethod(property(...))` tricks.

from functools import cached_property

class Heavy:
    def __init__(self, n: int) -> None:
        self.n = n

    @cached_property
    def square(self) -> int:
        print("computing...")
        return self.n * self.n

h = Heavy(5)
print(h.square)                 # Output: computing...  25
print(h.square)                 # Output: 25  (cached, no print)

# 🧠 cached_property is like @property but computes once and stores.
#    Use it for expensive reads that never change.


# ============================================================
#  📌 RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Convention        │ Meaning                             |
# ─────────────────────────────────────────────────────────────
# | name              │ Public API                          |
# | _name             │ Protected — internal use hint       |
# | __name            │ Private — name-mangled              |
# | __name__          │ Dunder — reserved by Python         |
# ─────────────────────────────────────────────────────────────
# | Feature           │ Syntax / Notes                      |
# ─────────────────────────────────────────────────────────────
# | Read-only prop    │ @property (no setter)               |
# | Writable prop     │ @x.setter                           |
# | Deletable prop    │ @x.deleter                          |
# | Cached prop       │ @functools.cached_property          |
# | Fixed attributes  │ __slots__ = ("x", "y")              |
# | Mangled name      │ obj._Cls__private                   |
# ─────────────────────────────────────────────────────────────
# | Pitfall           │ Why it bites                        |
# ─────────────────────────────────────────────────────────────
# | Trusting _name    │ Nothing stops external access       |
# | Trusting __name   │ _Cls__name still reachable          |
# | No setter valid.  │ Silent bad data gets stored         |
# | Property + attr   │ Instance attr shadows property      |
# | __slots__ + mixin │ Multiple inheritance breaks         |
# ─────────────────────────────────────────────────────────────
#
# 🧠 BEST PRACTICES
#  - Default to public. Add _ and __ only when you have a reason.
#  - Use @property for anything that needs validation or compute.
#  - Never trust inputs — validate in the setter.
#  - Prefer @property over get_x()/set_x() methods.
#  - Reach for __slots__ only on small, fixed-shape classes.
#  - Document what is "internal" — code reviewers rely on `_`.
#  - Remember: Python privacy is a HANDSHAKE, not a lock.
# ============================================================