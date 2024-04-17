// Rest Parameters are defined using '...<argument/parameter name>'
// it must be at the end of the argument list/ last argument of a function no ',' is allowed after that
// A function definition can only have one rest parameter

function logids(...idarr) {
    idarr.forEach((id) => console.log(id));
}

logids(34,23,5,6,7,45,67)

function logshifts(day, ...persons){
    console.log(day);
    persons.forEach((person)=> console.log(person));
}

logshifts('Monday', 'ritik','tatya','sexa','husky')