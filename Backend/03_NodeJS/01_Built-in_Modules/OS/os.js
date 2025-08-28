import os from "os";
let i = 1;
console.log(os.arch());
os.cpus().map((val) => { console.log(i++, val , val["times"]) });
console.log(os.endianness());
console.log(os.freemem());
console.log(os.hostname());
console.log(os.loadavg());
console.log(os.networkInterfaces());
console.log(os.platform());
console.log(os.release());
console.log(os.tmpdir());
console.log(os.totalmem());
console.log(os.type());
console.log(os.uptime());
console.log(os.userInfo());

console.log(os.constants);
console.log(os.EOL);