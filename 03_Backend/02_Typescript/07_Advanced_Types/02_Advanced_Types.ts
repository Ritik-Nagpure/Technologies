// advanced-types.ts
// ✅ This file demonstrates advanced TypeScript types with detailed explanations and examples.

// ─────────────────────────────────────────────────────────────
// 🧠 Literal Types
// Restricts a variable to exact values (not just string or number).
// Useful for enforcing strict values like enums or commands.

type Direction = 'up' | 'down' | 'left' | 'right';
const move: Direction = 'left'; // ✅ Only allowed values
console.log('Literal Type:', move);

// ─────────────────────────────────────────────────────────────
// 🧠 Template Literal Types
// Constructs new string types using interpolation.
// Useful for enforcing naming conventions or dynamic keys.

type Lang = 'en' | 'fr' | 'de';
type GreetingKey = `greeting_${Lang}`; // 'greeting_en' | 'greeting_fr' | 'greeting_de'

const greet: GreetingKey = 'greeting_fr';
console.log('Template Literal Type:', greet);

// ─────────────────────────────────────────────────────────────
// 🧠 Mapped Types
// Creates new types by transforming keys of another type.
// Often used with keyof and utility types.

type UserKeys = 'id' | 'email';
type UserMap = { [K in UserKeys]: string };

const user: UserMap = { id: 'abc123', email: 'user@example.com' };
console.log('Mapped Type:', user);



// ─────────────────────────────────────────────────────────────
// 🧠 Conditional Types
// Allows types to be defined based on logic.
// Useful for generic type transformations.

type IsString<T> = T extends string ? 'yes' : 'no';
type Test1 = IsString<string>; // 'yes'
type Test2 = IsString<number>; // 'no'
console.log('Conditional Types:', { Test1: 'yes', Test2: 'no' });


// ─────────────────────────────────────────────────────────────
// 🧠 Recursive Types
// A type that refers to itself. Useful for trees, nested structures, etc.

type JSONValue =
    | string
    | number
    | boolean
    | null
    | JSONValue[]
    | { [key: string]: JSONValue };

const data: JSONValue = {
    name: 'Alice',
    age: 30,
    tags: ['dev', 'typescript'],
    address: {
        city: 'Pune',
        zip: 411001,
    },
};
console.log('Recursive Type:', data);


// ─────────────────────────────────────────────────────────────
// 🧠 Index Signatures
// Allows dynamic property keys with consistent value types.
// Useful for dictionaries, maps, or flexible objects.

type ScoreMap = { [name: string]: number };
const scores: ScoreMap = { Alice: 95, Bob: 88 };
console.log('Index Signature:', scores);


// ─────────────────────────────────────────────────────────────
// 🧠 Infer Keyword
// Used inside conditional types to extract a type from a structure.

type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type Result = ReturnType<() => boolean>; // boolean
console.log('Infer Keyword:', { Result: true });


// ─────────────────────────────────────────────────────────────
// 🧠 Nullable Types
// Allows a type to explicitly include `null` or `undefined`.
// Useful for optional values or delayed initialization.

type Maybe<T> = T | null | undefined;
const maybeName: Maybe<string> = undefined;
console.log('Nullable Type:', maybeName);


// ─────────────────────────────────────────────────────────────
// 🧠 Type Aliases vs Interfaces
// Both define object shapes. Interfaces can be merged and extended multiple times.
// Type aliases are more flexible (can represent unions, primitives, etc.).

type Alias = { x: number };
interface Shape { x: number }
interface Shape { y: number } // ✅ Merges with previous declaration

const point: Shape = { x: 10, y: 20 };
console.log('Interface Merge:', point);


// ─────────────────────────────────────────────────────────────
// 🧠 Discriminated Unions
// Combines multiple object types with a shared `kind` field.
// Enables exhaustive checks in switch statements.

type Circle = { kind: 'circle'; radius: number };
type Square = { kind: 'square'; side: number };
type ShapeUnion = Circle | Square;

function area(shape: ShapeUnion): number {
    switch (shape.kind) {
        case 'circle': return Math.PI * shape.radius ** 2;
        case 'square': return shape.side ** 2;
    }
}
console.log('Discriminated Union:', area({ kind: 'square', side: 5 }));


// ─────────────────────────────────────────────────────────────
// 🧠 Summary:
// - Literal: restricts values
// - Nullable: allows null/undefined
// - Interface vs Alias: shape vs flexibility
// - Discriminated Union: safe branching
// - Index Signature: dynamic keys
// - Mapped: transforms keys
// - Conditional: type logic
// - Infer: extract types
// - Recursive: nested structures
// - Template Literal: dynamic strings
