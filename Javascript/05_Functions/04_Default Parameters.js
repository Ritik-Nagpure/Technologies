// Default Parameters
// parameter of a function can have a default value so that if not given can also be called and executed.
// parameter will be overwritten is provided while calling

function getCity(name, city = "Nagpur"){
    console.log(`${name} leaves in ${city}`);
}

getCity("Neha");
getCity("Neha","Canada");