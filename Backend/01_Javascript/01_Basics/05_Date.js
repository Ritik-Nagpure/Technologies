// Date 
let dt = new Date();
console.log(dt);

console.log(dt.getDate());
console.log(dt.getDay()); // is a n array starts with 0 --> Sunday
console.log(dt.getMonth()); // is a n array starts with 0 --> January
console.log(dt.getFullYear());
console.log(dt.getHours());
console.log(dt.getMinutes());
console.log(dt.getMilliseconds());

console.log(dt.getUTCDate());

console.log("------------------- TO Local String -----------------");
console.log(dt.toLocaleString());
console.log(dt.toLocaleDateString());
console.log(dt.toLocaleTimeString());

console.log("------------------- TO String  -----------------");
console.log(dt.toDateString());
console.log(dt.toTimeString());
console.log(dt.toISOString());
console.log(dt.toUTCString());
console.log(dt.toString());

console.log("------------------- TO Custom String -----------------");
console.log(dt.toLocaleString('hi-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
    hour12: true
}));

console.log(dt.toLocaleString('ja-JP', { weekday: 'long' }));
console.log(dt.toLocaleString('fr-FR', { weekday: 'long' }));

