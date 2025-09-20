// ===============================
// 📦 GENERIC INTERFACES
// ===============================
// Generic interfaces define flexible contracts for objects that work with multiple types.

// ✅ Basic Generic Interface
interface Box<T> {
  content: T;
}

const stringBox: Box<string> = { content: "Books" };
const numberBox: Box<number> = { content: 99 };

// ✅ Interface with Multiple Generic Parameters
interface Result<T, E> {
  data?: T;
  error?: E;
}

const success: Result<string, null> = { data: "OK", error: null };
const failure: Result<null, string> = { data: null, error: "Failed" };

// ✅ Generic Interface with Function Type
interface Transformer<T> {
  transform(input: T): T;
}

const stringTransformer: Transformer<string> = {
  transform: (input) => input.toUpperCase(),
};

// ✅ Generic Interface with Constraints
interface LengthAware<T extends { length: number }> {
  value: T;
  getLength(): number;
}

const stringLength: LengthAware<string> = {
  value: "TypeScript",
  getLength() {
    return this.value.length;
  },
};

// ✅ Trick Questions
// - Can interfaces have default generic types? ❌ No—only functions and classes can
// - Can interfaces extend other generic interfaces? ✅ Yes
// - Can you implement a generic interface with a concrete type? ✅ Yes
