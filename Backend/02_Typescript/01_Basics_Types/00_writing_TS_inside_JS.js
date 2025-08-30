/* 📘 What JSDoc Does
Documents your code: You can describe functions, parameters, return types, classes, and more.

Enables type checking: When combined with // @ts-check, it lets TypeScript validate types in plain .js files.

Improves editor support: IDEs like VS Code use JSDoc to offer autocomplete, tooltips, and inline documentation.

Bonus: JSDOCcan be used to create to generate HTML documentation from your comments, turning your codebase into a browsable reference site.


    Tag                             Purpose
@param	                    Describes a function parameter
@returns	                Describes the return value
@typedef	                Defines a custom type
@type	                    Declares the type of a variable
@example	                Provides usage examples
@deprecated	                Marks code as outdated or discouraged


*/

// @ts-check

/**
 * Adds two numbers together.
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} The sum of the two numbers.
 */
function add(a, b) {
    return a + b;
}


console.log(add(5, 3));
console.log(add(5, '5'));