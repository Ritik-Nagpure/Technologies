// The node:console module provides a simple debugging console that is similar to the JavaScript console mechanism provided by web browsers.

// Prints: hello world, to stdout
console.log('hello world');

// Prints: hello world, to stdout
console.log('hello %s', 'world');

// Prints error message and stack trace to stderr:
console.error(new Error('Whoops, something bad happened'));


const nam = 'Will Robinson';
console.warn(`Danger ${nam}! Danger!`);