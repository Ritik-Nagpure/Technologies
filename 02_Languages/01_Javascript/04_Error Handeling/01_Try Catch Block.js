try {
    console.log(a);
}
catch (err) {
    console.log(err.message);
    console.error(err.message);
    console.log(err);
}


// console.log ==> create logs normally
// console.error ==> create logs as error
// err ==> this object has all error data
// loging err will log everything along with stack trace
// err.message will log only the error message
// err has other properties too