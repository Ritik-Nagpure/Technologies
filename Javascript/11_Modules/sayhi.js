export function hi() {
  console.log(`Hello`);
}

export let bye = () => {
  console.log(`Bye`);
}

let greetme = () =>{
  console.log("This is a default export by Ritik");
}

export default greetme;