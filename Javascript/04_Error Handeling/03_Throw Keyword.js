// throw keyword thors an error but we need to specify it with Error() object if not it throws it as a string or other datatype
function guessNumber(num){
    try {
        if( num != 7){
            //throw "not correct number increase your count";
            throw 7;
        }
    }
    catch (err) {
        console.error(err);
        console.error(typeof(err));
    }
}

guessNumber(4);