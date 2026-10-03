// user-error-demo.js

console.log('🔧 Custom (User-Specified) Error Handling in Node.js\n');

// ✅ Define a custom error class
class ValidationError extends Error {
  constructor(message) {
    super(message); // Call the parent constructor
    this.name = 'ValidationError'; // Set a custom error name
  }
}

// ✅ Another example: Authentication error
class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthError';
  }
}

// ✅ Simulate a function that throws a custom error
function validateUserInput(input) {
  if (typeof input !== 'string') {
    throw new ValidationError('Input must be a string');
  }
  if (input.trim() === '') {
    throw new ValidationError('Input cannot be empty');
  }
  console.log('✅ Input is valid:', input);
}

// ✅ Simulate a function that throws an AuthError
function authenticateUser(token) {
  if (!token || token !== 'secure-token') {
    throw new AuthError('Invalid authentication token');
  }
  console.log('🔐 User authenticated successfully');
}

// ✅ Handle custom errors using try-catch
try {
  validateUserInput(42); // Will throw ValidationError
} catch (err) {
  if (err instanceof ValidationError) {
    console.error('ValidationError:', err.message);
  } else {
    console.error('Unknown error:', err.message);
  }
}

try {
  authenticateUser('wrong-token'); // Will throw AuthError
} catch (err) {
  if (err instanceof AuthError) {
    console.error('AuthError:', err.message);
  } else {
    console.error('Unknown error:', err.message);
  }
}

// ✅ Generic error handling pattern
function runSafe(fn) {
  try {
    fn();
  } catch (err) {
    console.error(`❌ ${err.name}: ${err.message}`);
  }
}

// Example usage
runSafe(() => validateUserInput('')); // Empty string triggers ValidationError
runSafe(() => authenticateUser('secure-token')); // Success

console.log('\n✅ Custom error handling demo complete.');
