function div(num1, num2){
    return num1/num2;
}

function start(num1, num2){
    try{
        let a = div(num1, num2);
        console.log(a);
    }
    
    catch(Error){
        console.error(Error);
    }
    finally{
        console.log("program finished !!");
    }
}

start(25,5);
start(25,0);

// finally block is executed everytime irrespective of error thrown or not