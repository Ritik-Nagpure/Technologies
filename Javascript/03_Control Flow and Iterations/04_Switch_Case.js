let val = 0

// Switch Case
// each of the cases is tested and which everis true is excuted 
// to make sure only case if true a break; state ment can be used to exit the switch block
// if none is true default is executed which requires no break statement as its the last case and switch block is then exited by thread/pointer
switch (val) {
    case 1:
        console.log(val);
        break;

    case 2:
        console.log(val);
        break;

    case 3:
        console.log(val);
        break;

    case 4:
        console.log(val);
        break;

    default:
        console.log("No cases matched out of 4");
}