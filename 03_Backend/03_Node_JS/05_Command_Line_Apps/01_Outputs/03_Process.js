// process-output-demo.js

console.log('🖥️ Node.js Output Using process.stdout and process.stderr\n');

// ✅ Basic Output
process.stdout.write('This is standard output using process.stdout.write\n');
process.stderr.write('This is error output using process.stderr.write\n');

// ✅ Manual Formatting
const username = 'Alice';
const age = 30;
process.stdout.write(`User: ${username}, Age: ${age}\n`);

// ✅ Colored Output using ANSI escape codes
process.stdout.write(' \x1b[32m Success: \\x1b[0m Operation completed \n'); // Green
process.stderr.write(' \x1b[31m Error: \\x1b[0m Something went wrong \n');   // Red

// ✅ Manual Table Printing (no console.table, no external modules)
const headers = ['Name', 'Age', 'Role'];
const rows = [
    ['Alice', 30, 'Admin'],
    ['Bob', 25, 'User'],
    ['Charlie', 35, 'Moderator']
];

// Function to pad each column for alignment
function pad(str, width) {
    str = String(str);
    return str.length >= width ? str : str + ' '.repeat(width - str.length);
}

// Print header
process.stdout.write('\n📊 User Table:\n');
process.stdout.write(headers.map(h => pad(h, 12)).join('') + '\n');
process.stdout.write('-'.repeat(headers.length * 12) + '\n');

// Print rows
rows.forEach(row => {
    process.stdout.write(row.map(cell => pad(cell, 12)).join('') + '\n');
});

// ✅ Simulated DataFrame Output
const dataFrame = {
    columns: ['Product', 'Price', 'Stock'],
    rows: [
        ['Pen', 10, 'Available'],
        ['Notebook', 50, 'Low'],
        ['Marker', 20, 'Out of Stock']
    ]
};

process.stdout.write('\n📋 Simulated DataFrame:\n');
process.stdout.write(dataFrame.columns.map(h => pad(h, 15)).join('') + '\n');
process.stdout.write('-'.repeat(dataFrame.columns.length * 15) + '\n');
dataFrame.rows.forEach(row => {
    process.stdout.write(row.map(cell => pad(cell, 15)).join('') + '\n');
});

// ✅ Check if terminal is interactive
if (process.stdout.isTTY) {
    process.stdout.write('\n✅ stdout is connected to a terminal\n');
}
if (process.stderr.isTTY) {
    process.stderr.write('✅ stderr is connected to a terminal\n');
}

// ✅ Summary
/*
  - process.stdout.write(): fine-grained control over standard output
  - process.stderr.write(): separate error stream for error logging
  - ANSI escape codes: add color and style to terminal output
  - Manual table printing: pad columns for alignment without external packages
  - Useful for CLI tools, structured logs, and formatted reports
*/

process.stdout.write('\n✅ Output demo complete.\n');
