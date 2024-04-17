// computed method name using brackets [...]

class User {

    ['say' + 'Hi']() { // here method name is created by adding two strings 
      console.log("Hello");
    }
  
  }
  
  new User().sayHi();