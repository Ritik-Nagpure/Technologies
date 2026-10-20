# 09_Multiple_Inheritance_and_MRO.py

# ============================================================
#  📘 MULTIPLE INHERITANCE & MRO IN PYTHON
#
#  Python allows a class to inherit from MULTIPLE parents. The
#  Method Resolution Order (MRO) is a linearised list computed
#  by the C3 algorithm that decides which parent's method runs
#  when names collide. Understanding MRO is essential for
#  cooperative multiple inheritance (mixins) and for debugging
#  the infamous "diamond problem".
#
#  Sections:
#   1. What multiple inheritance is
#   2. Syntax and basic behaviour
#   3. The diamond problem
#   4. C3 linearisation — how MRO is computed
#   5. Viewing the MRO
#   6. Cooperative multiple inheritance with super()
#   7. Mixins — the primary use case
#   8. Common pitfalls
#   9. Edge cases, version notes
# ============================================================


# ============================================================
#  1️⃣ WHAT MULTIPLE INHERITANCE IS
# ============================================================
# 🔹 A class can inherit from more than one base class.
# 🔹 All parents' public/protected members are available.
# 🔸 When the same name exists in multiple parents, MRO decides.
# 🎯 Primary use in Python: MIXINS — small classes that add
#    focused behaviour to a class without an "is-a" relationship.

class Walker:
    def walk(self) -> str:
        return "walking"

class Swimmer:
    def swim(self) -> str:
        return "swimming"

class Duck(Walker, Swimmer):
    def quack(self) -> str:
        return "quack"

d = Duck()
print(d.walk())                 # Output: walking
print(d.swim())                 # Output: swimming
print(d.quack())                # Output: quack

# 🧠 Duck "can" walk and swim — that's a mixin-style composition
#    of behaviours, not a hierarchy.


# ============================================================
#  2️⃣ SYNTAX AND BASIC BEHAVIOUR
# ============================================================
# 🔹 class Child(Base1, Base2, Base3): ...
# 🔸 Order of bases MATTERS for MRO and attribute lookup.
# 🔸 `object` is the implicit ultimate root of every class.

class A:
    def hello(self) -> str: return "A"

class B:
    def hello(self) -> str: return "B"

class C(A, B):
    pass

print(C().hello())              # Output: A  ← A comes first in MRO

class D(B, A):
    pass

print(D().hello())              # Output: B  ← B comes first in MRO

# ⚠️ Changing the order of bases changes which method wins —
#    always document why the order is what it is.


# ============================================================
#  3️⃣ THE DIAMOND PROBLEM
# ============================================================
# 🔹 Classic diamond: D inherits from B and C, both inherit from A.
# 🔸 Question: if B and C both override a method, which does D get?
# 🔸 Python's answer: MRO linearises the diamond so that A runs ONCE.

class Base:
    def tag(self) -> str:
        return "Base"

class Left(Base):
    def tag(self) -> str:
        return "Left -> " + super().tag()

class Right(Base):
    def tag(self) -> str:
        return "Right -> " + super().tag()

class Diamond(Left, Right):
    def tag(self) -> str:
        return "Diamond -> " + super().tag()

print(Diamond().tag())
# Output: Diamond -> Left -> Right -> Base

# 🔎 super() does NOT mean "the parent class" — it means "the NEXT
#    class in the MRO after the CURRENT one". This is why Left's
#    super() call lands on Right, not Base.
print([c.__name__ for c in Diamond.mro()])
# Output: ['Diamond', 'Left', 'Right', 'Base', 'object']

# 🧠 The diamond problem is solved — but only if every class in
#    the chain uses super() COOPERATIVELY.


# ============================================================
#  4️⃣ C3 LINEARISATION — HOW MRO IS COMPUTED
# ============================================================
# 🔹 Python uses the C3 algorithm (from Dylan / CLOS).
# 🔸 Rules:
#     • A class always precedes its parents.
#     • The relative order of parents is preserved.
#     • The order of each parent's own MRO is preserved.
# 🔹 If no consistent linearisation exists → TypeError at class
#    definition time.

# ❌ Inconsistent MRO example — Python refuses to build the class
class X: pass
class Y: pass
class A1(X, Y): pass
class B1(Y, X): pass
# class C1(A1, B1): pass        # ❌ TypeError: Cannot create a
                                #    consistent MRO

# ✅ A legal multiple-inheritance diamond
class Root: pass
class L(Root): pass
class R(Root): pass
class LR(L, R): pass

print([c.__name__ for c in LR.mro()])
# Output: ['LR', 'L', 'R', 'Root', 'object']

# 🧠 If Python can't find a consistent order, the class simply
#    won't be created — you get TypeError at definition.


# ============================================================
#  5️⃣ VIEWING THE MRO
# ============================================================
# 🔹 Cls.mro()          → returns a list of classes in order.
# 🔹 Cls.__mro__        → tuple version.
# 🔹 Cls.__bases__      → direct parents (not full chain).
# 🔸 Use this when debugging method-not-found issues.

class Logger:
    def log(self, msg: str) -> str: return f"[LOG] {msg}"

class Timestamper:
    def log(self, msg: str) -> str:
        import time
        return f"[{time.strftime('%H:%M')}] " + msg

class Service(Logger, Timestamper):
    pass

print(Service.mro())
# Output: [<class 'Service'>, <class 'Logger'>, <class 'Timestamper'>, <class 'object'>]

print(Service.__bases__)        # Output: (<class 'Logger'>, <class 'Timestamper'>)
print(Service().log("hi"))      # Output: [LOG] hi  ← Logger wins

# 🔎 Method lookup: Python walks the MRO left to right, stopping
#    at the first class that defines the attribute.


# ============================================================
#  6️⃣ COOPERATIVE MULTIPLE INHERITANCE WITH super()
# ============================================================
# 🔹 "Cooperative" means every class in the chain calls super()
#    so the NEXT MRO class gets a turn.
# 🔸 Requires methods to accept **kwargs and pass them along.
# 🎯 This is the pattern used by frameworks (Django, attrs).

class Base:
    def __init__(self, **kwargs: object) -> None:
        self.base = True

class A(Base):
    def __init__(self, a: int, **kwargs: object) -> None:
        super().__init__(**kwargs)
        self.a = a

class B(Base):
    def __init__(self, b: int, **kwargs: object) -> None:
        super().__init__(**kwargs)
        self.b = b

class C(A, B):
    def __init__(self, c: int, **kwargs: object) -> None:
        super().__init__(**kwargs)
        self.c = c

obj = C(a=1, b=2, c=3)
print(obj.a, obj.b, obj.c, obj.base)
# Output: 1 2 3 True

# ✅ Every __init__ runs exactly once — in MRO order.
print(C.mro())
# Output: [C, A, B, Base, object]

# ⚠️ If any class in the chain forgets to call super().__init__()
#    or swallows **kwargs, the chain breaks.
# 🧠 Rule: always accept **kwargs in cooperative __init__ and
#    pass them to super().

# 🔎 Non-cooperative version — call super() only sometimes:
class BadA(Base):
    def __init__(self, a: int) -> None:
        self.a = a              # ❌ no super() call
        # Base.__init__ never runs when B is not present

class BadB(Base):
    def __init__(self, b: int) -> None:
        self.b = b              # ❌ no super() call

class BadC(BadA, BadB):
    def __init__(self) -> None:
        BadA.__init__(self, 1)  # ❌ explicitly calling parent

# ⚠️ This "manual parent call" pattern looks tempting but breaks
#    with multiple inheritance. Use cooperative super() instead.


# ============================================================
#  7️⃣ MIXINS — THE PRIMARY USE CASE
# ============================================================
# 🔹 A mixin is a small class providing ONE focused behaviour.
# 🔸 Mixins rarely have __init__ or state; they add methods.
# 🎯 Naming convention: end with "Mixin".
# 🧠 Place mixins FIRST in the bases list so they can override
#    the base class's behaviour.

import json
from typing import Any

class JsonMixin:
    def to_json(self) -> str:
        return json.dumps(self.__dict__, default=str)

class LogMixin:
    def log(self) -> None:
        print(f"[{type(self).__name__}] {self.__dict__}")

class User(JsonMixin, LogMixin):
    def __init__(self, name: str, age: int) -> None:
        self.name = name
        self.age = age

u = User("Ravi", 30)
print(u.to_json())              # Output: {"name": "Ravi", "age": 30}
u.log()                         # Output: [User] {'name': 'Ravi', 'age': 30}

# ✅ JsonMixin and LogMixin have no state, no __init__ — pure
#    behaviour add-ons. Perfect mixin candidates.

# ⚠️ A mixin that defines __init__ must call super().__init__()
#    cooperatively — otherwise the class that uses it breaks.
class TimestampMixin:
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)   # 🔸 cooperative
        import time
        self.created_at = time.time()

class Record(TimestampMixin, User):
    pass

r = Record("Meera", 25)
print(r.name, r.age, hasattr(r, "created_at"))
# Output: Meera 25 True

# 🧠 Mixin rule of thumb: NO __init__, NO state, use super() if
#    you must implement __init__ anyway.


# ============================================================
#  8️⃣ COMMON PITFALLS
# ============================================================
# ⚠️ 1. Calling the parent by NAME instead of super()
class Parent:
    def greet(self) -> str: return "hi"

class Child(Parent):
    def greet(self) -> str:
        return Parent.greet(self) + "!"     # ❌ breaks MRO cooperation

class ChildOK(Parent):
    def greet(self) -> str:
        return super().greet() + "!"        # ✅ cooperative

# ⚠️ 2. Diamond with non-cooperative methods — only the FIRST
#    parent's method runs; the second is silently skipped.
class LeftBad:
    def tag(self) -> str: return "Left"

class RightBad:
    def tag(self) -> str: return "Right"

class DiamondBad(LeftBad, RightBad):
    pass

print(DiamondBad().tag())       # Output: Left  ← Right's tag never runs

# ⚠️ 3. Non-**kwargs __init__ in a mixin blocks downstream classes.
class BadMixin:
    def __init__(self, x: int) -> None:     # ❌ no **kwargs
        self.x = x

# class Combined(BadMixin, User):
#     pass                      # ❌ TypeError when Combined(...) is called

# ⚠️ 4. isinstance against EVERY base can be surprising.
print(isinstance(u, JsonMixin)) # Output: True
print(isinstance(u, LogMixin))  # Output: True

# ⚠️ 5. Two mixins with same method name → first in MRO wins.
class MixA:
    def tag(self) -> str: return "A"

class MixB:
    def tag(self) -> str: return "B"

class UsesBoth(MixA, MixB): pass
print(UsesBoth().tag())         # Output: A


# ============================================================
#  9️⃣ EDGE CASES, VERSION NOTES
# ============================================================
# ⚠️ super() with NO arguments uses the CURRENT class's MRO —
#    so inside classmethod and staticmethod it works too (3.0+).
# ⚠️ A class can have only ONE metaclass; combining bases with
#    different metaclasses raises TypeError unless one derives
#    from the other.
# ⚠️ `object` is always LAST in the MRO.
# ⚠️ `super().__init_subclass__` and `__init_subclass__` are
#    called for EVERY subclass — careful with heavy logic.

# 🕒 Version notes
# - C3 linearisation adopted: Python 2.3+
# - Zero-arg super(): Python 3.0+
# - `__mro__` attribute: from Python 2.3+
# - `__init_subclass__` hook: Python 3.6+
# - `__set_name__` used by descriptors in mixins: 3.6+
# - `super()` inside comprehensions / nested functions: still
#   requires explicit form `super(Cls, self)` — the zero-arg form
#   only works when `__class__` is in scope lexically.

# 🔎 Real-world Python examples of multiple inheritance:
#   • Django class-based views (Mixin patterns)
#   • collections.abc (Sequence, MutableMapping)
#   • socketserver (BaseRequestHandler + mixins)
#   • pyqt / tkinter widget mixins
#   • attrs / pydantic mixin-style decorators


# ============================================================
#  📌 RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Concept              │ Syntax / Notes                    |
# ─────────────────────────────────────────────────────────────
# | Multiple inheritance │ class C(A, B): ...                |
# | View MRO             │ C.mro()  /  C.__mro__             |
# | Direct parents       │ C.__bases__                       |
# | Cooperative call     │ super().method(**kwargs)          |
# | Mixin naming         │ ClassNameMixin                    |
# | Runtime lookup       │ first class in MRO that has attr  |
# ─────────────────────────────────────────────────────────────
# | Diamond MRO example                                         │
# ─────────────────────────────────────────────────────────────
# | class Diamond(Left, Right): ...                             │
# | MRO = [Diamond, Left, Right, Base, object]                  │
# | super() inside Left → Right (next in MRO, NOT its parent)   │
# ─────────────────────────────────────────────────────────────
# | Pitfall                    │ Why it bites                   |
# ─────────────────────────────────────────────────────────────
# | Parent.method(self)        │ Skips rest of MRO              │
# | No **kwargs in mixin       │ Breaks cooperative chain       │
# | Inconsistent MRO           │ TypeError at class creation    │
# | Same method in two mixins  │ First in bases list wins       │
# | Metaclass conflict         │ TypeError                      │
# | Heavy __init_subclass__    │ Runs on every subclass         │
# ─────────────────────────────────────────────────────────────
#
# 🧠 BEST PRACTICES
#  - Prefer MIXINS (behaviour) over deep multiple inheritance.
#  - Always use super() cooperatively — never call parent by name.
#  - Accept **kwargs in every __init__ that might be in a chain.
#  - Name mixins with a `Mixin` suffix; keep them stateless.
#  - Place mixins FIRST in the bases list.
#  - Keep hierarchies shallow; document the MRO if it matters.
#  - Use composition if the "is-a" story isn't clear.
#  - Reach for abc/Protocols when you need a contract.
# ============================================================