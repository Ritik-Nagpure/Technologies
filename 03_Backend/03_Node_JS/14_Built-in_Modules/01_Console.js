// console-output-demo.js

console.log('🖥️ Node.js Console Output Module Demo\n');

// ✅ Basic Logging
console.log('console.log: Standard output');
console.info('console.info: Informational message');
console.warn('console.warn: Warning message');
console.error('console.error: Error message');

// ✅ Debugging
console.debug('console.debug: Debug-level message');
console.trace('console.trace: Stack trace from this point');

// ✅ Assertions
console.assert(2 + 2 === 5, 'Assertion failed: 2 + 2 !== 5');

// ✅ Performance Timing
console.time('timer1');
for (let i = 0; i < 1000000; i++) {} // Simulate workload
console.timeEnd('timer1'); // Logs elapsed time

// ✅ Counting
console.count('loop');
console.count('loop');
console.countReset('loop');
console.count('loop');

// ✅ Grouping Logs
console.group('User Info');
console.log('Name: Alice');
console.log('Age: 30');
console.groupEnd();

// ✅ Collapsed Group
console.groupCollapsed('Hidden Details');
console.log('This group is collapsed by default');
console.groupEnd();

// ✅ Formatting Output
console.log('Hello %s, you are %d years old', 'Bob', 25);
console.log('Object output:', { name: 'Charlie', age: 40 });

// ✅ Clearing Console (may not work in all terminals)
console.clear();
console.log('Console cleared — continuing demo...');

// ✅ Summary
/*
  - Use console methods for logging, debugging, and performance tracking.
  - console.log/info/warn/error for different message levels.
  - console.time/count/group for structured and timed output.
  - Avoid excessive logging in production; use structured loggers like winston or pino.
*/

console.log('\n✅ Console output demo complete.');

// console-advanced-demo.js

console.log('📊 Advanced Console Output in Node.js\n');

// ✅ console.table(): Display tabular data
const users = [
  { name: 'Alice', age: 30, role: 'Admin' },
  { name: 'Bob', age: 25, role: 'User' },
  { name: 'Charlie', age: 35, role: 'Moderator' }
];

console.log('🧾 console.table():');
console.table(users);
// Explanation: Displays array of objects as a readable table.

// ✅ console.dir(): Inspect objects with depth and color options
const nestedObject = {
  level1: {
    level2: {
      level3: {
        value: 'deep'
      }
    }
  }
};

console.log('\n🔍 console.dir():');
console.dir(nestedObject, { depth: null, colors: true });
// Explanation: Shows full depth of nested object with optional color formatting.

// ✅ Comparison with console.log()
console.log('\n📦 console.log():');
console.log(nestedObject);
// Explanation: console.log prints the object, but may truncate deeply nested structures.

// ✅ Summary
/*
  - Use console.table() for structured tabular data.
  - Use console.dir() for inspecting deeply nested objects.
  - These tools improve readability and debugging efficiency.
*/

console.log('\n✅ Advanced console demo complete.');
