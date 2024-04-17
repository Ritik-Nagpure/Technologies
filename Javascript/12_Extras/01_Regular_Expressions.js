// RegEX  or RegExp or Regular Expressions or Rational Expressions
// it is a sequence of characters that specifies a match pattern in text. 
// refer : https://regexr.com/ for Details
// use a regex site to create a regex pattern and use it as you want. ex. to create monitor, serch for error pattern, phone numbers, etc.
// https://github.com/ziishaned/learn-regex/blob/master/README.md

const str = "This is an example of this regex topic. this time we are working with this string. to get this word in capital.";

const str1 = "this is an example to learn about the extract numbers. larry 9568 shaw 8954 Ben 7894. now extract numbers here and contact + numbers. here are few code words HBJE2342RT ERBO3451LA WHPC9873EL";

const regex = /this/g; // create a regex pattern for global operation

console.log(str);
console.log(str.replace("this", ">>>>THIS<<<<<")); // replace only the first occurance
console.log(str.replace(regex, "***THIS***")); // replace all occurances

const getNums = /\d\d\d\d/g; // Get 4 digit numbers from string
const getPan = /\w{4}\d{4}\w{2}/g // Get Pan number from string
const getNameNum = /\w{1,7}\s\d{4}/g // Get Name + Number from string

console.log(str1);
console.log(str1.match(getPan)); // RETURNS AN ARRAY

logiterator(str1.matchAll(getNameNum)); // RETURNS AN ITERATOR
logiterator(str1.matchAll(getNums));
logiterator(str1.matchAll(getPan));

getNames(str1.matchAll(getNameNum))


function logiterator(regexiterator) {
    let isdone = true
    while (isdone) {
        let val = regexiterator.next();
        if (!val.done) {
            console.log(val.value[0]);
        }
        else {
            isdone = false;
        }
    }
}

function getNames(regexiterator) {
    let isdone = true
    while (isdone) {
        let val = regexiterator.next();
        if (!val.done) {
            console.log(val.value[0].toString().split(" ")[0]);
        }
        else {
            isdone = false;
        }
    }
}