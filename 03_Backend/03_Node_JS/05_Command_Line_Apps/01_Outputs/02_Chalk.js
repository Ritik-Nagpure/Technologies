import chalk , {Chalk} from 'chalk';

/*
    Chalk.js Complete Notes

    Chalk is a popular Node.js library for styling terminal string output with colors and effects.
    It’s widely used for building visually rich command-line interfaces.

    Installation:
        npm install chalk

    Importing Chalk (ESM and CommonJS):
        import chalk from 'chalk'; // ESM
        // const chalk = require('chalk'); // CommonJS
    
    note: 
        ->  works only in terminal when used with node.
        ->  output terminal is not able to show the output as expected due to limitations.
*/

/*
    1. Basic Usage: Coloring Text
*/
console.log(chalk.red('This is red text'));
console.log(chalk.green('This is green text'));
console.log(chalk.blue('This is blue text'));

/*
    2. Styling Text: Bold, Underline, etc.
*/
console.log(chalk.bold('Bold text'));
console.log(chalk.underline('Underlined text'));
console.log(chalk.inverse('Inverted colors'));

/*
    3. Combining Styles
*/
console.log(chalk.blue.bold.underline('Blue, bold, and underlined'));

/*
    4. Nesting Styles
*/
console.log(chalk.red('Red ' + chalk.underline.bgBlue('underlined blue background') + ' text'));

/*
    5. Background Colors
*/
console.log(chalk.bgYellow('Yellow background'));
console.log(chalk.bgMagenta('Magenta background'));

/*
    6. Hex and RGB Colors
*/
console.log(chalk.hex('#FFA500')('Orange text using HEX'));
console.log(chalk.rgb(123, 45, 67)('Custom RGB color'));

/*
    7. Template Literals with Chalk
*/
const error = chalk.bold.red;
console.log(error(`Error: Something went wrong!`));

/*
    8. Chalk Levels (Support for 16m, 256, 16 colors)
*/
console.log('Chalk color support level:', chalk.level);

/*
    9. Disabling Chalk (useful for logging to files)
*/
const noColor = new Chalk({ level: 0 });
console.log(noColor.red('This will not be colored'));

/*
    10. Printing Tables/DataFrames in Terminal
    Using console.table and manual formatting
*/
const data = [
    { Name: chalk.green('Alice'), Age: 25, City: chalk.blue('New York') },
    { Name: chalk.yellow('Bob'), Age: 30, City: chalk.magenta('London') },
];
console.log('\n📊 Table using console.table:');
console.table(data);

/*
    Manual Table Printing (no external packages)
*/
const headers = ['Name', 'Age', 'City'];
const rows = [
    [chalk.green('Alice'), 25, chalk.blue('New York')],
    [chalk.yellow('Bob'), 30, chalk.magenta('London')],
];

// Pad function for column alignment
function pad(str, width) {
    str = String(str);
    return str.length >= width ? str : str + ' '.repeat(width - str.length);
}

console.log('\n📋 Manual Table Output:');
console.log(headers.map(h => pad(h, 15)).join(''));
console.log('-'.repeat(headers.length * 15));
rows.forEach(row => {
    console.log(row.map(cell => pad(cell, 15)).join(''));
});

/*
    11. Useful Chalk Methods and Properties
*/
console.log(chalk.dim('Dimmed text'));
console.log(chalk.strikethrough('Strikethrough text'));
console.log(chalk.italic('Italic text'));
console.log(chalk.bgHex('#00FF00').black('Black text on green background'));

/*
    12. Custom Chalk Instances
*/
const customChalk = new Chalk({ level: 3 });
console.log(customChalk.hex('#FF69B4').bold('Custom instance with pink bold text'));

/*
    Summary:
    - Chalk styles terminal output with colors and effects.
    - Supports chaining, nesting, HEX/RGB colors, and custom instances.
    - Use console.table or manual formatting for table-like output.
    - Avoid external packages if you want lightweight styling.
*/
