/* 🧠 JS's Job:

     JavaScript is like a toy manager:
        It puts simple toys on the stack.
        It puts big, detailed toys in the heap.
        And it keeps track so you don’t lose anything (until you throw it away).


--> 5 y/o ans

    🧺 Stack Memory – The Toy Shelf
    Think of the stack like a super neat shelf where toys are put one after the other in a tall stack.
    🧼 It's very organized — first toy in, last toy out!
    🧠 It’s used for simple, quick things, like numbers and small boxes.
    🚀 Super fast — like grabbing the top toy quickly.
    Example: If you say, “Let’s play with the number 5,” it goes right on the stack. Easy peasy!


--> Interview ans

 
What it is:
    Stack memory is used for static memory allocation.
    It stores primitive values, function calls, and local variables.
    It works on LIFO (Last-In, First-Out) principle.

Key Traits:

    🚀 Fast access and allocation
    🧼 Automatically managed by the system
    📦 Function calls and variable scopes live here


Notes: 
--> Pritimitive datatypes are stored in stack memory.
--> whenever a operation like this ( a = 5; b= a; ) is performed, the value of 'a' is copied to 'b' in stack memory.
--> this means a=5 abd b=5 are two different variables in stack memory.
--> changing anyone a/b will not change the other variable.

*/

function greet() {
    let name = "Max"; // Stored in stack
    console.log("Hello " + name);
}