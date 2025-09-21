// assertion-error-demo.js

console.log('🔍 Assertion Errors in Node.js\n');

// ✅ Import Node.js built-in 'assert' module
// No need to install anything — it's built-in
import assert from 'assert'

// ✅ Basic assertion: throws error if condition is false
try {
  assert(2 + 2 === 5, 'Math is broken!');
} catch (err) {
  console.error('AssertionError:', err.message);
  // Explanation: The condition is false, so assert throws an AssertionError.
}

// ✅ Using assert.strictEqual: checks strict equality (===)
try {
  assert.strictEqual('hello', 'world', 'Strings do not match');
} catch (err) {
  console.error('strictEqual AssertionError:', err.message);
}

// ✅ Using assert.deepStrictEqual: compares objects deeply
try {
  const expected = { a: 1 };
  const actual = { a: '1' };
  assert.deepStrictEqual(actual, expected, 'Objects are not deeply equal');
} catch (err) {
  console.error('deepStrictEqual AssertionError:', err.message);
}

// ✅ Custom assertion function
function validateAge(age) {
  assert(typeof age === 'number', 'Age must be a number');
  assert(age >= 0, 'Age cannot be negative');
  console.log('✅ Age is valid:', age);
}

try {
  validateAge(-5); // Will throw
} catch (err) {
  console.error('Custom AssertionError:', err.message);
}

// ✅ Handling AssertionError specifically
try {
  assert(false, 'This will fail');
} catch (err) {
  if (err instanceof assert.AssertionError) {
    console.error('Caught an AssertionError:', err.message);
  } else {
    console.error('Unknown error:', err.message);
  }
}

console.log('\n✅ Assertion error demo complete.');
