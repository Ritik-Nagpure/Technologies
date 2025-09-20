
// ─────────────────────────────────────────────────────────────
// PARTIAL<T>: Makes all properties in a type optional.
// Useful when creating objects step-by-step or with defaults.
type User = { name: string; age: number };
function createUser(data: Partial<User>) {
  console.log('Partial:', data);
}
createUser({ name: 'Alice' }); // age is optional

// ─────────────────────────────────────────────────────────────
// REQUIRED<T>: Makes all optional properties required.
// Useful when enforcing complete data.
type OptionalUser = { name?: string; age?: number };
const fullUser: Required<OptionalUser> = { name: 'Bob', age: 30 };
console.log('Required:', fullUser);

// ─────────────────────────────────────────────────────────────
// READONLY<T>: Prevents reassignment of properties.
// Great for immutability and safe data structures.
const readonlyUser: Readonly<User> = { name: 'Carol', age: 25 };
// readonlyUser.age = 26; // ❌ Error if uncommented
console.log('Readonly:', readonlyUser);

// ─────────────────────────────────────────────────────────────
// PICK<T, K>: Selects specific keys from a type.
// Useful for extracting only needed fields.
type NameOnly = Pick<User, 'name'>;
const nameObj: NameOnly = { name: 'Dave' };
console.log('Pick:', nameObj);

// ─────────────────────────────────────────────────────────────
// OMIT<T, K>: Removes specific keys from a type.
// Useful when excluding sensitive or irrelevant fields.
type WithoutAge = Omit<User, 'age'>;
const noAge: WithoutAge = { name: 'Eve' };
console.log('Omit:', noAge);

// ─────────────────────────────────────────────────────────────
// RECORD<K, T>: Creates an object type with fixed keys and value types.
// Ideal for mapping roles, statuses, or enums.
type Role = 'admin' | 'guest';
const roleMap: Record<Role, string> = {
  admin: 'Alice',
  guest: 'Bob',
};
console.log('Record:', roleMap);

// ─────────────────────────────────────────────────────────────
// EXCLUDE<T, U>: Removes types from a union.
// Useful for filtering out unwanted variants.
type Status = 'draft' | 'published' | 'archived';
type VisibleStatus = Exclude<Status, 'archived'>;
const status: VisibleStatus = 'published';
console.log('Exclude:', status);

// ─────────────────────────────────────────────────────────────
// EXTRACT<T, U>: Keeps only matching types from a union.
// Useful for narrowing down to specific variants.
type PublicStatus = Extract<Status, 'published' | 'archived'>;
const pubStatus: PublicStatus = 'archived';
console.log('Extract:', pubStatus);

// ─────────────────────────────────────────────────────────────
// NONNULLABLE<T>: Removes null and undefined from a type.
// Useful for enforcing definite values.
type Maybe = string | null | undefined;
type Definitely = NonNullable<Maybe>;
const safe: Definitely = 'Hello';
console.log('NonNullable:', safe);

// ─────────────────────────────────────────────────────────────
// RETURNTYPE<T>: Gets the return type of a function.
// Useful for reusing function output types.
function greet(): string {
  return 'Hi!';
}
type GreetReturn = ReturnType<typeof greet>;
const msg: GreetReturn = greet();
console.log('ReturnType:', msg);

// ─────────────────────────────────────────────────────────────
// PARAMETERS<T>: Gets the parameter types of a function.
// Useful for forwarding or validating arguments.
function sum(a: number, b: number): number {
  return a + b;
}
type SumParams = Parameters<typeof sum>;
const args: SumParams = [5, 7];
console.log('Parameters:', args, '→ Sum:', sum(...args));

// ─────────────────────────────────────────────────────────────
// CONSTRUCTORPARAMETERS<T>: Gets constructor argument types.
// Useful for instantiating classes dynamically.
class Person {
  constructor(public name: string, public age: number) {}
}
type PersonArgs = ConstructorParameters<typeof Person>;
const personArgs: PersonArgs = ['Zoe', 22];
const person = new Person(...personArgs);
console.log('ConstructorParameters:', person);

// ─────────────────────────────────────────────────────────────
// INSTANCETYPE<T>: Gets the instance type from a constructor.
// Useful for type-safe object creation.
type PersonInstance = InstanceType<typeof Person>;
const anotherPerson: PersonInstance = new Person('Max', 40);
console.log('InstanceType:', anotherPerson);

// ─────────────────────────────────────────────────────────────
// THISPARAMETERTYPE<T>: Gets the type of `this` in a function.
// Useful for binding context-aware functions.
function say(this: Person, msg: string) {
  console.log(`${this.name} says: ${msg}`);
}
type ThisTypeOfSay = ThisParameterType<typeof say>;
const boundSay = say.bind(person);
boundSay('Hello!');

// ─────────────────────────────────────────────────────────────
// OMITTHISPARAMETER<T>: Removes `this` from function type.
// Useful for converting methods to standalone functions.
type SayWithoutThis = OmitThisParameter<typeof say>;
const speak: SayWithoutThis = (msg) => console.log('Someone says:', msg);
speak('Hi there!');

// ─────────────────────────────────────────────────────────────
// AWAITED<T>: Resolves the type inside a Promise.
// Useful for async type inference.
async function getName(): Promise<string> {
  return 'AsyncName';
}
type ResolvedName = Awaited<ReturnType<typeof getName>>;
getName().then((name: ResolvedName) => console.log('Awaited:', name));
