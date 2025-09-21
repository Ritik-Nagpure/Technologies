// javascript-errors-demo.js

console.log('🧠 JavaScript Built-in Error Types\n');

// ✅ ReferenceError: accessing a variable that hasn't been declared
try {
  console.log(notDeclaredVar);
} catch (err) {
  console.error('ReferenceError:', err.message);
  // Explanation: Variable is not defined in the current scope.
}

// ✅ TypeError: using a value in an inappropriate way
try {
  null.f(); // Trying to call a method on null
} catch (err) {
  console.error('TypeError:', err.message);
  // Explanation: You can't call a function on a non-object like null or undefined.
}

// ✅ SyntaxError: invalid code structure
try {
  eval('function () {}'); // Invalid function syntax
} catch (err) {
  console.error('SyntaxError:', err.message);
  // Explanation: Code has incorrect syntax and can't be parsed.
}

// ✅ RangeError: value is outside the allowed range
try {
  const arr = new Array(-1); // Negative array length
} catch (err) {
  console.error('RangeError:', err.message);
  // Explanation: Array length must be a non-negative integer.
}

// ✅ URIError: malformed URI passed to encode/decode
try {
  decodeURIComponent('%'); // Invalid URI component
} catch (err) {
  console.error('URIError:', err.message);
  // Explanation: URI functions expect properly encoded strings.
}

// ✅ EvalError: improper use of eval (rare in modern JS)
try {
  throw new EvalError('Custom eval misuse');
} catch (err) {
  console.error('EvalError:', err.message);
  // Explanation: Historically used for eval-related issues.
}

// ✅ Custom Error: define your own error type
class CustomError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CustomError';
  }
}

try {
  throw new CustomError('Something went wrong in your logic');
} catch (err) {
  console.error(`${err.name}:`, err.message);
  // Explanation: You can create custom error types for specific use cases.
}

console.log('\n✅ JavaScript error demo complete.');
