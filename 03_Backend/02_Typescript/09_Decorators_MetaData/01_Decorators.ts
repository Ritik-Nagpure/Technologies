// ===============================
// 🎨 DECORATORS
// ===============================
// ✅ Decorators are special declarations that can modify classes, methods, properties, or parameters.
// They are prefixed with @ and require `"experimentalDecorators": true` in tsconfig.json.

// ✅ Enable in tsconfig.json: "experimentalDecorators": true

// ──────────────── CLASS DECORATOR ────────────────
// 🎯 Used to observe, modify, or replace a class definition
function LogClass(constructor: Function) {
  console.log(`Class loaded: ${constructor.name}`);
}

@LogClass
class Example {
  // ──────────────── PROPERTY DECORATOR ────────────────
  // 🧩 Applied to class properties; useful for validation, metadata, etc.
  @LogProperty
  title: string = 'TS Decorators';

  private _val: number = 0;

  // ──────────────── ACCESSOR DECORATOR ────────────────
  // 🔍 Applied to getters/setters; can control access or log usage
  @LogAccessor
  get value() {
    return this._val;
  }

  // ──────────────── METHOD DECORATOR ────────────────
  // ⚙️ Wraps or modifies method behavior (e.g., logging, caching)
  @LogMethod
  update(@LogParam newVal: number) {
    this._val = newVal;
  }
}

// ──────────────── DECORATOR DEFINITIONS ────────────────
function LogProperty(target: any, key: string) {
  console.log(`Property Decorator → ${key}`);
}

function LogAccessor(target: any, key: string, desc: PropertyDescriptor) {
  console.log(`Accessor Decorator → ${key}`);
}

function LogMethod(target: any, key: string, desc: PropertyDescriptor) {
  const orig = desc.value;
  desc.value = function (...args: any[]) {
    console.log(`Method Decorator → ${key}, Args: ${args}`);
    return orig.apply(this, args);
  };
}

function LogParam(target: any, key: string, index: number) {
  console.log(`Parameter Decorator → ${key}, Index: ${index}`);
}

// 🧠 Summary:
// - Class: modifies or observes class constructor.
// - Property: attaches metadata or validation to fields.
// - Accessor: controls getter/setter logic.
// - Method: wraps method logic (e.g., logging).
// - Parameter: tracks or validates method arguments.
