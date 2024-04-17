// to create custom error we need to use throw statement 
function guessNumber(num){
    try {
        if( num > 7){
            throw new Error("not correct number decrease your count");
        }
        if( num < 7 ){
            throw Error("not correct number increase your count");
        }
    }
    catch (err) {
        console.error(err.message);
    }
}

guessNumber(4);