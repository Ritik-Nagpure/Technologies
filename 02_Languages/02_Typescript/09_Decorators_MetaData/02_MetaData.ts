// metadata.ts
// ✅ Enable in tsconfig.json: "experimentalDecorators": true, "emitDecoratorMetadata": true
// 📦 Install reflect-metadata: npm i reflect-metadata

import 'reflect-metadata';

// ──────────────── WHAT IS METADATA? ────────────────
// 🧠 Metadata is data about data—used to store design-time type info.
// Decorators + metadata = powerful tools for validation, DI, serialization, etc.

// ──────────────── PROPERTY METADATA ────────────────
function LogType(target: any, key: string) {
  const type = Reflect.getMetadata('design:type', target, key);
  console.log(`Property ${key} type: ${type.name}`);
}

class Book {
  @LogType
  title: string;

  @LogType
  pages: number;
}

// ──────────────── METHOD METADATA ────────────────
function LogMethodMeta(target: any, key: string, desc: PropertyDescriptor) {
  const returnType = Reflect.getMetadata('design:returntype', target, key);
  const paramTypes = Reflect.getMetadata('design:paramtypes', target, key);
  console.log(`Method ${key} return: ${returnType.name}`);
  console.log(`Method ${key} params: ${paramTypes.map((t: any) => t.name).join(', ')}`);
}

class Calculator {
  @LogMethodMeta
  add(a: number, b: number): number {
    return a + b;
  }
}

// ──────────────── CUSTOM METADATA ────────────────
// 🧩 You can define your own metadata keys and values
function SetMeta(key: string, value: any) {
  return Reflect.metadata(key, value);
}

function GetMeta(target: any, key: string) {
  const val = Reflect.getMetadata('custom:info', target, key);
  console.log(`Custom metadata on ${key}: ${val}`);
}

class User {
  @SetMeta('custom:info', 'Sensitive field')
  password: string;

  @GetMeta
  showPassword() {}
}

// 🧵 Summary:
// - `reflect-metadata` enables runtime type inspection.
// - Built-in keys: 'design:type', 'design:paramtypes', 'design:returntype'.
// - Use for validation, DI, serialization, and more.
