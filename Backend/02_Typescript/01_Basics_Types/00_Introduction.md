# TypeScript

## 🧠 What is TypeScript (TS)?
TypeScript is a superset of JavaScript that adds static typing. That means you can define types (like string, number, boolean, etc.) for variables, function parameters, and return values.

- Developed by Microsoft
- Compiles to plain JavaScript
- Helps catch errors early during development

## 🚀 Why Use TypeScript?
Here’s why developers love TS:

- **Type Safety** : Prevents bugs by catching type-related errors before runtime
- **Better Tooling** : Autocomplete, refactoring, and navigation are much smoother
- **Scalability** : Easier to manage large codebases
- **Modern Features** : Supports ES6+ features and compiles down for older browsers

## ⚔️ TypeScript vs JavaScript
| Feature               | JavaScript (JS)                          | TypeScript (TS)                                  |
|----------------------|------------------------------------------|--------------------------------------------------|
| Language Type        | Dynamically typed                        | Statically typed (optional typing)               |
| Compilation          | Interpreted directly by browsers         | Needs to be compiled to JavaScript               |
| Error Detection      | Runtime errors                           | Compile-time error checking                      |
| IDE Support          | Basic autocomplete                       | Advanced intellisense and type checking          |
| Learning Curve       | Easier for beginners                     | Slightly steeper due to type system              |
| Code Scalability     | Harder to manage in large projects       | Easier to scale with strong typing               |
| Community Support    | Massive ecosystem                        | Growing rapidly, backed by Microsoft             |
| Browser Compatibility| Native support                           | Requires transpilation to JS                     |
| Popular Use Cases    | Quick scripts, frontend development      | Large-scale apps, enterprise-level projects      |
| Type Definitions     | Not built-in                             | Built-in and extendable with DefinitelyTyped     |

##  Installing TypeScript
You can install it globally or locally:

1. Global (for quick scripts):

```bash
npm install -g typescript
```

2. Local (for projects):

```bash
npm install typescript --save-dev
```

## 🏃 Running an Individual TS File
1. Install TypeScript globally:
```bash
npm install -g typescript
```
2. Create a file: `hello.ts`

```ts
const greet = (name: string): string => {
  return `Hello, ${name}!`;
};

console.log(greet("TypeScript"));
```
3. Compile and run:

```bash
tsc hello.ts
node hello.js
```

## 🧰 Setting Up a TypeScript Project
1. Create a folder:

```bash
mkdir ts-project && cd ts-project
```
2. Initialize npm:

```bash
npm init -y
``` 
3. Install TypeScript locally:

```bash
npm install typescript --save-dev
```

4. Create a config file:

```bash
npx tsc --init
```
This generates tsconfig.json where you can customize compiler options.

5. Add source files in a src/ folder and compile:

```bash
npx tsc
```

## 🧪 Running TS with ts-node (No Compilation Needed)
ts-node lets you run .ts files directly without compiling them manually.

Install ts-node and typescript:

```bash
npm install -g ts-node typescript @types/node
```

Run your file:

```bash
ts-node hello.ts
```
Perfect for quick testing and development!

## 🏁 Summary: Running TypeScript
| Method        | Command                        | Use Case                        |
|---------------|--------------------------------|----------------------------------|
| Compile & Run | `tsc file.ts && node file.js`  | Standard workflow                |
| ts-node       | `ts-node file.ts`              | Quick testing                    |
| Project Build | `npx tsc`                      | Compiles all files in project    |
