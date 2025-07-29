// Break
// Breaks the current execution or loop execution. No further conditions will be checked once break is reached 
// looping ends and program continues to run from the line after the loop block.

for (i = 1; i < 20; i++) {
    if (i % 5 == 0) {
        console.log(`divisible by 5 is reached at ${i}`)
        console.log("Break detected");
        break
    }
    console.log(i)
}
console.log("Loop Ends here");


// Continue
// Skips current iteration.
// NO checks or further instructions will be executed for current iteration if continue is reached.
// execution restarts from next item of the iteration.

for (i = 1; i < 20; i++) {
    if (i % 5 == 0) {
        console.log(`divisible by 5 is reached at ${i}`)
        console.log("Continue detected");
        continue
    }
    console.log(i)
}
console.log("Loop Ends here");
