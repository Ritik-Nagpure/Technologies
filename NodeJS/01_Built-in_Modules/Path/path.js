import path from "path";

let fileloc = "G:/Node.js/JavaScript Notes/NodeJS/01_Built-in_Modules/Path/path.js"

console.log(path.basename(fileloc));
console.log(path.dirname(fileloc));
console.log(path.extname(fileloc));
console.log(path.isAbsolute(fileloc)); //Returns true if a path is an absolute path, otherwise false
let newfileloc = path.join(path.dirname(fileloc),"newone.txt");
console.log(newfileloc);
console.log(path.normalize(fileloc));
console.log(path.parse(fileloc));
console.log(path.relative(fileloc,newfileloc));
console.log(path.resolve(fileloc,newfileloc));
let obj = { dir: path.dirname(fileloc) , base: 'demo_path.js' }
console.log(path.format(obj));
console.log(path.isAbsolute(path.format(obj)));

console.log(path.delimiter);
console.log(path.posix);
console.log(path.sep);
console.log(path.win32);
