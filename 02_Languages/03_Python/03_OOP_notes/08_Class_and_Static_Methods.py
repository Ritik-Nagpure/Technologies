# 08_Class_and_Static_Methods.py

# ============================================================
#  📘 INSTANCE / CLASS / STATIC METHODS IN PYTHON
#
#  Python has three kinds of methods on a class:
#    1. Instance methods  → receive `self`
#    2. Class methods     → receive `cls`  (@classmethod)
#    3. Static methods    → receive nothing (@staticmethod)
#
#  Choosing the right kind keeps code idiomatic and makes
#  dependencies explicit: does the logic need the instance, the
#  class, or neither?
#
#  Sections:
#   1. The three method types at a glance
#   2. Instance methods (self)
#   3. Class methods (@classmethod, cls)
#   4. Static methods (@staticmethod)
#   5. Alternate constructors with @classmethod
#   6. Subclass-aware factory pattern
#   7. When to use which — decision guide
#   8. Edge cases, pitfalls, version notes
# ============================================================


# ============================================================
#  1️⃣ THE THREE METHOD TYPES AT A GLANCE
# ============================================================
# 🔹 Instance method  → first arg is the INSTANCE (self)
# 🔹 Class method     → first arg is the CLASS (cls)
# 🔹 Static method    → no implicit first arg
# 🎯 The question: "does this method need data from the object,
#    from the class, or from neither?"

class Pizza:
    base_price = 100                    # class attribute

    def __init__(self, toppings: list[str]) -> None:
        self.toppings = toppings

    # 🔹 instance method — uses self
    def price(self) -> int:
        return self.base_price + 20 * len(self.toppings)

    # 🔸 class method — uses cls
    @classmethod
    def base(cls) -> int:
        return cls.base_price

    # 🔸 static method — uses nothing
    @staticmethod
    def is_vegetarian(toppings: list[str]) -> bool:
        meat = {"pepperoni", "ham", "sausage"}
        return not (set(toppings) & meat)

p = Pizza(["cheese", "basil"])
print(p.price())                        # Output: 140
print(Pizza.base())                     # Output: 100
print(Pizza.is_vegetarian(p.toppings))  # Output: True


# ============================================================
#  2️⃣ INSTANCE METHODS (self)
# ============================================================
# 🔹 The default. First parameter is the instance.
# 🔸 Can read/write instance state and class state.
# 🔸 Called as `obj.method()` — Python passes obj as `self`.

class Counter:
    def __init__(self) -> None:
        self.count = 0

    def inc(self) -> int:               # instance method
        self.count += 1
        return self.count

c = Counter()
print(c.inc())                          # Output: 1
print(c.inc())                          # Output: 2

# ✅ Can also be called explicitly via the class:
print(Counter.inc(c))                   # Output: 3

# ⚠️ Calling on the class WITHOUT an instance fails:
# Counter.inc()                         # ❌ TypeError: missing 1 required positional argument: 'self'


# ============================================================
#  3️⃣ CLASS METHODS (@classmethod, cls)
# ============================================================
# 🔹 First arg is the CLASS, not the instance.
# 🔸 Called on the class OR on an instance (both work).
# 🎯 Common use: alternate constructors, factories, config
#    lookups, subclass-aware behaviour.

class User:
    default_role = "guest"

    def __init__(self, name: str, role: str) -> None:
        self.name = name
        self.role = role

    @classmethod
    def create_guest(cls, name: str) -> "User":
        return cls(name, cls.default_role)

    @classmethod
    def set_default_role(cls, role: str) -> None:
        cls.default_role = role

u = User.create_guest("Ravi")
print(u.name, u.role)                   # Output: Ravi guest

User.set_default_role("member")
u2 = User.create_guest("Meera")
print(u2.role)                          # Output: member

# 🔎 Notice: `cls.default_role` reads the CLASS attribute — always
#    the current value, even after mutation.

# ⚠️ Using `User.default_role` inside the classmethod would break
#    subclass behaviour — always use `cls`.
class Admin(User):
    default_role = "admin"

a = Admin.create_guest("Boss")
print(a.role)                           # Output: admin  (thanks to cls)


# ============================================================
#  4️⃣ STATIC METHODS (@staticmethod)
# ============================================================
# 🔹 No self, no cls. Just a plain function namespaced inside a class.
# 🔸 Use for utility logic that logically belongs to the class but
#    doesn't touch instance or class state.
# 🔸 Can be called on class or instance.

class MathUtil:
    @staticmethod
    def is_prime(n: int) -> bool:
        if n < 2:
            return False
        for i in range(2, int(n ** 0.5) + 1):
            if n % i == 0:
                return False
        return True

    @staticmethod
    def gcd(a: int, b: int) -> int:
        while b:
            a, b = b, a % b
        return a

print(MathUtil.is_prime(17))            # Output: True
print(MathUtil.gcd(24, 36))             # Output: 12
print(MathUtil().is_prime(4))           # Output: False  (works via instance too)

# ⚠️ Static methods do NOT receive self or cls — trying to use
#    them raises NameError.
# class Bad:
#     @staticmethod
#     def f(): return self.x            # ❌ NameError

# 🧠 If a method uses no self / cls state, ask: does it REALLY
#    belong to this class? Sometimes a module-level function is
#    cleaner. Use @staticmethod for logically-grouped utilities.


# ============================================================
#  5️⃣ ALTERNATE CONSTRUCTORS WITH @classmethod
# ============================================================
# 🔹 Python has ONE __init__ — you cannot overload it.
# 🔸 @classmethod factories are the idiomatic way to build
#    instances from different input shapes.

class Point:
    def __init__(self, x: float, y: float) -> None:
        self.x, self.y = x, y

    @classmethod
    def from_tuple(cls, t: tuple[float, float]) -> "Point":
        return cls(*t)

    @classmethod
    def from_string(cls, s: str) -> "Point":
        x, y = s.split(",")
        return cls(float(x), float(y))

    @classmethod
    def origin(cls) -> "Point":
        return cls(0.0, 0.0)

    def __repr__(self) -> str:
        return f"Point({self.x}, {self.y})"

print(Point.from_tuple((1, 2)))         # Output: Point(1, 2)
print(Point.from_string("3,4"))         # Output: Point(3.0, 4.0)
print(Point.origin())                   # Output: Point(0.0, 0.0)

# 🧠 Every alternate constructor uses `cls(...)` — NEVER hardcode
#    `Point(...)` — so subclasses work correctly.

class Point3D(Point):
    def __init__(self, x: float, y: float, z: float = 0.0) -> None:
        super().__init__(x, y)
        self.z = z

# ⚠️ Subclass factories need matching signatures — this raises
#    TypeError because Point3D.__init__ requires an extra arg with
#    no default. But with a default, `cls(*t)` works fine.
p3 = Point3D.from_tuple((1, 2))         # ✅ works — z defaults to 0.0
print(p3)                               # Output: Point(1, 2)


# ============================================================
#  6️⃣ SUBCLASS-AWARE FACTORY PATTERN
# ============================================================
# 🔹 @classmethod + cls is the foundation of the "factory" pattern
#    that respects inheritance.
# 🎯 Real-world example: parsers, plugin loaders, ORM instances.

class Document:
    def __init__(self, content: str) -> None:
        self.content = content

    @classmethod
    def from_file(cls, path: str) -> "Document":
        with open(path, "r", encoding="utf-8") as f:
            return cls(f.read())

    def __repr__(self) -> str:
        return f"{type(self).__name__}({self.content!r})"

class Markdown(Document):
    pass

class Html(Document):
    pass

# ✅ Each subclass automatically reads its own kind of file.
#    (Real code would specialise parsing in each subclass.)

# 🔎 Factory methods always call `cls(...)`, not the parent name.

# ⚠️ If you need extra args in a subclass, either:
#    • provide defaults, or
#    • override the classmethod in the subclass.


# ============================================================
#  7️⃣ WHEN TO USE WHICH — DECISION GUIDE
# ============================================================
# 🔹 Does the method need to READ/WRITE `self`?
#    → instance method.
#
# 🔹 Does the method need the class (factory, config, class attr,
#    subclass-aware behaviour)?
#    → @classmethod.
#
# 🔹 Does the method touch NO instance or class state?
#    → @staticmethod (or consider a module-level function).
#
# 🧠 Smell test:
#    • @staticmethod that never calls cls/self AND doesn't feel
#      related to the class → move it to module level.
#    • @classmethod that doesn't use cls → should probably be
#      @staticmethod.
#    • instance method that never uses self → suspicious.

class Utils:
    @staticmethod
    def clean(s: str) -> str:
        # 🔎 Zero relation to Utils as a concept — better as a
        #    module-level function. Shown here for contrast.
        return s.strip().lower()

# 🎯 Rule of thumb: favour the LEAST powerful method that fits.
#    If instance isn't needed, use classmethod; if class isn't
#    needed, use staticmethod; if neither, use a function.


# ============================================================
#  8️⃣ EDGE CASES, PITFALLS, VERSION NOTES
# ============================================================
# ⚠️ @classmethod can be called on an INSTANCE, but it still
#    receives the CLASS, not the instance — no `self` access.

class Demo:
    @classmethod
    def who(cls) -> str:
        return f"I am the class {cls.__name__}"

d = Demo()
print(d.who())                          # Output: I am the class Demo

# ⚠️ @staticmethod can be shadowed by instance attributes — if you
#    name an instance attribute the same as a staticmethod, the
#    instance attribute wins on lookup.

# ⚠️ @classmethod + inheritance: `cls` is the LEAF class — always
#    use cls, never the parent name, in factories.

# ⚠️ Cannot easily combine @classmethod with @property.
#    `@classmethod @property` order breaks; use a custom descriptor
#    or `classmethod(property(...))` (Python 3.9+ idiom).

class HasVersion:
    _version = "1.0"

    @classmethod
    def get_version(cls) -> str:
        return cls._version

print(HasVersion.get_version())         # Output: 1.0

# ✅ The clean way for class-level properties: use a metaclass or
#    a descriptor. Explicit method is usually clearer.

# ⚠️ Order matters when stacking decorators. `@classmethod` must
#    be the OUTERMOST of the stack that turns a function into a
#    method:
#        @classmethod
#        @some_other_decorator
#        def m(cls): ...
#    Reversing usually breaks.

# 🕒 Version notes
# - @staticmethod and @classmethod: Python 2.2+ / 2.4+ (syntax)
# - @classmethod + subclass-aware `cls` factories: idiomatic
#   since Python 2.6+
# - Zero-arg super() inside classmethods: Python 3.0+
# - `@classmethod @property` chain (docs recommend against): works
#   since Python 3.9 via `classmethod(property(...))`
# - functools.singledispatchmethod (per-type dispatch on methods):
#   Python 3.8+


# ============================================================
#  📌 RECAP TABLE
# ─────────────────────────────────────────────────────────────
# | Method type       │ First arg  │ Decorator          │ Use for  |
# ─────────────────────────────────────────────────────────────
# | Instance          │ self       │ (none)             │ obj data |
# | Class             │ cls        │ @classmethod       │ factory  |
# | Static            │ —          │ @staticmethod      │ utility  |
# ─────────────────────────────────────────────────────────────
# | Feature                │ Called as                    │
# ─────────────────────────────────────────────────────────────
# | obj.method()           │ instance method              │
# | Cls.method()           │ class or static method       │
# | obj.class_method()     │ works — passes cls           │
# | obj.static_method()    │ works — no implicit arg      │
# ─────────────────────────────────────────────────────────────
# | Pitfall                    │ Why it bites                 |
# ─────────────────────────────────────────────────────────────
# | cls replaced by class name │ Breaks subclasses            │
# | Missing cls / self         │ TypeError on call            │
# | @staticmethod using self  │ NameError                    │
# | @classmethod on instance   │ Still receives cls           │
# | Wrong decorator order      │ Method signature breaks      │
# | Staticmethod for util      │ Maybe belongs at module level│
# ─────────────────────────────────────────────────────────────
#
# 🧠 BEST PRACTICES
#  - Use @classmethod for alternate constructors; call `cls(...)`.
#  - Use @staticmethod only for logic that logically groups here.
#  - Prefer the least powerful method that solves the problem.
#  - Never hardcode the class name inside a classmethod.
#  - If a staticmethod never touches the class, consider a
#    module-level function instead.
#  - Keep factories returning `cls(...)` for subclass-friendliness.
#  - Document WHY a method is class vs static in its docstring.
# ============================================================