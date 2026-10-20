# 05_Abstraction.py

# ============================================================
#  📘 ABSTRACTION IN PYTHON — COMPLETE COVERAGE
#
#  Abstraction means exposing WHAT something does while hiding
#  HOW it does it. In Python this is achieved with Abstract Base
#  Classes (ABCs), `@abstractmethod`, `@abstractproperty`, and
#  the `abc` module. ABCs enforce a contract: subclasses MUST
#  implement certain methods before they can be instantiated.
#
#  This file covers: the concept of abstraction, ABCs, abstract
#  methods, abstract properties, virtual subclasses, the
#  collections.abc module, and how abstraction differs from
#  encapsulation.
#
#  Sections:
#   1. Abstraction vs encapsulation
#   2. Why abstraction matters
#   3. Abstract Base Classes (ABC)
#   4. @abstractmethod — enforcing a contract
#   5. Abstract properties
#   6. Abstract class attributes
#   7. Virtual subclasses (register)
#   8. collections.abc — ready-made ABCs
#   9. Edge cases, pitfalls, version notes
# ============================================================


# ============================================================
#  1️⃣ ABSTRACTION VS ENCAPSULATION
# ============================================================
# 🔹 Encapsulation → hide the DATA (how it's stored).
# 🔹 Abstraction   → hide the IMPLEMENTATION (how it works).
# 🔸 Encapsulation is about access; abstraction is about design.
# 🎯 Abstraction says: "Any PaymentProcessor must be able to
#    charge(amount). HOW it charges is up to each subclass."

# 🧠 Real-world analogy:
#    - You drive a car (abstraction: steering wheel, pedals).
#    - You don't open the engine to move forward (encapsulation).


# ============================================================
#  2️⃣ WHY ABSTRACTION MATTERS
# ============================================================
# 🔹 Defines a common INTERFACE for a family of classes.
# 🔹 Prevents instantiation of incomplete classes.
# 🔸 Makes the intent explicit: "you MUST override this."

# ❌ Without ABC — nothing stops wrong usage
class PaymentBad:
    def charge(self, amount: float) -> None:
        raise NotImplementedError       # only fails at call time

# ✅ With ABC — fails at INSTANTIATION time, much earlier
from abc import ABC, abstractmethod

class Payment(ABC):
    @abstractmethod
    def charge(self, amount: float) -> None: ...

# p = Payment()                         # ❌ TypeError: can't instantiate

# 🧠 Fail fast: ABCs catch missing implementations at construction,
#    not deep inside a call stack.


# ============================================================
#  3️⃣ ABSTRACT BASE CLASSES (ABC)
# ============================================================
# 🔹 Inherit from abc.ABC to opt into the abstract machinery.
# 🔸 ABCs can still have concrete methods and __init__.
# 🔸 Only @abstractmethod-decorated members are enforced.

class Shape(ABC):
    def __init__(self, name: str) -> None:
        self.name = name                # ✅ concrete __init__

    @abstractmethod
    def area(self) -> float: ...        # MUST override

    @abstractmethod
    def perimeter(self) -> float: ...   # MUST override

    def describe(self) -> str:          # ✅ concrete — inherited as-is
        return f"{self.name}: area={self.area():.2f}"

class Circle(Shape):
    def __init__(self, r: float) -> None:
        super().__init__("Circle")
        self.r = r

    def area(self) -> float:
        return 3.14159 * self.r ** 2

    def perimeter(self) -> float:
        return 2 * 3.14159 * self.r

c = Circle(5)
print(c.describe())                     # Output: Circle: area=78.54

# ❌ Cannot instantiate an incomplete subclass
class BrokenShape(Shape):
    def area(self) -> float: return 0.0
    # perimeter not implemented

# b = BrokenShape("X")                  # ❌ TypeError

# ⚠️ The error message lists missing methods — read it carefully.
# 🧠 Abstract methods can have a body (default impl) that subclasses
#    may call via super().method().


# ============================================================
#  4️⃣ @abstractmethod — ENFORCING A CONTRACT
# ============================================================
# 🔹 Any method decorated with @abstractmethod MUST be overridden.
# 🔸 Order matters: @abstractmethod goes innermost.
# 🔸 Overriding with a non-abstract method "unlocks" the class.

class Storage(ABC):
    @abstractmethod
    def save(self, key: str, value: bytes) -> None: ...

    @abstractmethod
    def load(self, key: str) -> bytes: ...

class MemoryStorage(Storage):
    def __init__(self) -> None:
        self._data: dict[str, bytes] = {}

    def save(self, key: str, value: bytes) -> None:
        self._data[key] = value

    def load(self, key: str) -> bytes:
        return self._data[key]

s = MemoryStorage()
s.save("a", b"hello")
print(s.load("a"))                      # Output: b'hello'

# 🔎 @abstractmethod uses __isabstractmethod__ flag; ABCMeta scans
#    for it at class creation time.
print(Storage.__abstractmethods__)
# Output: frozenset({'save', 'load'})

print(MemoryStorage.__abstractmethods__)
# Output: frozenset()

# ⚠️ Re-decorating an already abstract method in a subclass keeps
#    it abstract — the class remains uninstantiable.
class StillAbstract(Storage):
    @abstractmethod
    def save(self, key: str, value: bytes) -> None: ...

# StillAbstract()                       # ❌ TypeError


# ============================================================
#  5️⃣ ABSTRACT PROPERTIES
# ============================================================
# 🔹 Combine @property with @abstractmethod for required attributes.
# 🔸 Order: @property OUTSIDE, @abstractmethod INSIDE.

class Entity(ABC):
    @property
    @abstractmethod
    def id(self) -> int: ...

    @property
    @abstractmethod
    def name(self) -> str: ...

class User(Entity):
    def __init__(self, id_: int, name_: str) -> None:
        self._id = id_
        self._name = name_

    @property
    def id(self) -> int:
        return self._id

    @property
    def name(self) -> str:
        return self._name

u = User(1, "Ravi")
print(u.id, u.name)                     # Output: 1 Ravi

# ⚠️ Gotcha: reversing the decorator order raises AttributeError.
#    @abstractmethod OUTSIDE @property → the property is not created.
# ❌ Wrong:
#     @abstractmethod
#     @property
#     def id(self) -> int: ...

# 🧠 Abstract properties force subclasses to expose a NAMED
#    attribute — very useful for interfaces / DTOs.


# ============================================================
#  6️⃣ ABSTRACT CLASS ATTRIBUTES
# ============================================================
# 🔹 Plain (non-method) attributes are NOT enforced by ABCMeta.
# 🔸 To require a class attribute, use a dummy @property or check
#    in __init_subclass__.
# 🔎 Simpler alternative: annotate + validate.

class Config(ABC):
    # An annotation alone does NOT enforce presence.
    version: str

    def __init_subclass__(cls, **kwargs: object) -> None:
        super().__init_subclass__(**kwargs)
        if "version" not in cls.__dict__:
            raise TypeError(f"{cls.__name__} must define `version`")

class FileConfig(Config):
    version = "1.0"

print(FileConfig.version)               # Output: 1.0

# ❌ Missing `version` → TypeError at class definition time
# class BadConfig(Config): pass         # ❌ TypeError: BadConfig must define `version`

# 🧠 Annotations document intent, but __init_subclass__ enforces it.


# ============================================================
#  7️⃣ VIRTUAL SUBCLASSES (register)
# ============================================================
# 🔹 ABC.register(SomeClass) declares SomeClass a virtual subclass.
# 🔸 isinstance / issubclass then return True — no inheritance.
# 🎯 Useful for third-party classes you can't modify.

class Printable(ABC):
    @abstractmethod
    def show(self) -> str: ...

class LegacyPrinter:                    # does NOT inherit Printable
    def show(self) -> str:
        return "legacy output"

Printable.register(LegacyPrinter)

lp = LegacyPrinter()
print(isinstance(lp, Printable))        # Output: True
print(issubclass(LegacyPrinter, Printable))   # Output: True

# ⚠️ register bypasses the abstract check — LegacyPrinter is not
#    forced to implement show(). It's a promise, not a contract.
# 🧠 Use sparingly — explicit inheritance is clearer.

# 🔎 Modern alternative: use a Protocol (see 04).


# ============================================================
#  8️⃣ collections.abc — READY-MADE ABCs
# ============================================================
# 🔹 The standard library ships ABCs for common protocols:
#    Iterable, Sequence, Mapping, MutableMapping, Set, Callable...
# 🔸 Subclass them to get free mixin methods (e.g., __contains__,
#    __iter__, keys/values/items for Mapping).

from collections.abc import Sequence
from typing import overload

class Playlist(Sequence):
    def __init__(self, songs: list[str]) -> None:
        self._songs = songs

    @overload
    def __getitem__(self, i: int) -> str: ...
    @overload
    def __getitem__(self, s: slice) -> "Playlist": ...
    def __getitem__(self, i):           # 🔸 required by Sequence
        if isinstance(i, slice):
            return Playlist(self._songs[i])
        return self._songs[i]

    def __len__(self) -> int:           # 🔸 required by Sequence
        return len(self._songs)

pl = Playlist(["A", "B", "C"])
print(pl[0])                            # Output: A
print("B" in pl)                        # Output: True  (free from Sequence)
print(len(pl))                          # Output: 3
print(list(pl[1:]))                     # Output: ['B', 'C']

# 🧠 Subclassing collections.abc gives you a LOT for free — the
#    base class provides __contains__, __iter__, __reversed__,
#    index(), count() based on your __getitem__ / __len__.


# ============================================================
#  9️⃣ EDGE CASES, PITFALLS, VERSION NOTES
# ============================================================
# ⚠️ ABCs cannot be instantiated — even with no abstract methods?
#    If ABC has NO abstract methods, it CAN be instantiated.
class Marker(ABC):
    pass
Marker()                                # ✅ allowed — no enforcement

# ⚠️ @abstractmethod on a private __method is NOT enforced
#    due to name mangling.
# ⚠️ Abstract methods CAN have an implementation — subclasses must
#    still override, but they can call super().m().
# ⚠️ Mixing ABC with __slots__ works but requires care.

class SlottedABC(ABC):
    __slots__ = ("x",)
    @abstractmethod
    def m(self) -> None: ...

class SlottedImpl(SlottedABC):
    __slots__ = ()
    def __init__(self, x: int) -> None: self.x = x
    def m(self) -> None: print("ok")

SlottedImpl(1).m()                      # Output: ok

# ⚠️ ABCMeta and multiple metaclasses must be combined carefully —
#    a class can have only ONE metaclass.

# 🕒 Version notes
# - `abc` module introduced: Python 2.6+
# - `ABC` convenience base class: Python 3.4+
# - `@abstractmethod` combined with @property: works since 3.3+
# - `__init_subclass__`: Python 3.6+ (alternative to ABCs for some cases)
# - `collections.abc` moved from `collections`: Python 3.3+
# - `typing.Protocol` as modern alternative: Python 3.8+
# - Runtime-checkable Protocols: Python 3.8+
# - `abc.ABC` still recommended for runtime enforcement


# ============================================================
#  📌 RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Concept                  │ Syntax / Notes                  |
# ─────────────────────────────────────────────────────────────
# | Abstract base class      │ class X(ABC): ...               |
# | Abstract method          │ @abstractmethod                 |
# | Abstract property        │ @property + @abstractmethod     |
# | Abstract class attr      │ __init_subclass__ check         |
# | Virtual subclass         │ Base.register(Sub)              |
# | List abstract methods    │ Cls.__abstractmethods__         |
# | Ready-made ABCs          │ collections.abc.Sequence, ...   |
# ─────────────────────────────────────────────────────────────
# | Abstraction vs Encapsulation                                │
# ─────────────────────────────────────────────────────────────
# | Abstraction : hide HOW → interfaces, ABCs                   |
# | Encapsulation: hide DATA → _ / __ / @property               |
# ─────────────────────────────────────────────────────────────
# | Pitfall                  │ Why it bites                      |
# ─────────────────────────────────────────────────────────────
# | Wrong decorator order    │ @abstractmethod @property breaks  |
# | ABC without abstract     │ Can still be instantiated         |
# | Private abstract method  │ Name-mangled → not enforced       |
# | register() misuse        │ No runtime enforcement            |
# | Multiple metaclasses     │ Metaclass conflict errors         |
# ─────────────────────────────────────────────────────────────
#
# 🧠 BEST PRACTICES
#  - Use ABCs when you NEED runtime enforcement of a contract.
#  - Use Protocol (file 04) when static checking is enough.
#  - Keep ABCs small — one or two abstract methods maximum.
#  - Provide concrete helper methods in the ABC, not just stubs.
#  - Document the contract in the ABC docstring.
#  - Prefer collections.abc over hand-rolled collections.
#  - Fail fast: let ABCMeta raise TypeError at class creation.
#  - Remember: annotation alone does NOT enforce attributes.
# ============================================================