// Switch Case
// each of the cases is tested and which everis true is excuted 
// to make sure only case if true a break; statement can be used to exit the switch block
// if no break is present it won't exist and continue to execute every other case which is true untill break; is executed or switch block ends.
// <imp> in JS if a case is true and no breaks are present all other cases will be executed regardless of their true or false resukt.
// if none is true default is executed which requires no break statement as its the last case and switch block is then exited by thread/pointer

let val = 4

switch (val) {
    case 4:
        console.log("Case 4 TOP");
        break;

    case 1:
        console.log("Case 1");
        break;

    case 2:
        console.log("Case 2");
        break;

    case 3:
        console.log("Case 3");
        break;

    case 4:
        console.log("Case 4 Bottom");
        break;

    default:
        console.log("No cases matched out of 4");
}