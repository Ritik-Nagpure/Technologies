// ===============================
// 🔐 ACCESS CONTROL & PROPERTIES
// ===============================
// This file explores how TypeScript classes manage access to properties and methods,
// using public, private, protected, readonly, and static modifiers. It also introduces encapsulation.

// ✅ Public (default)
// Public members are accessible from anywhere—inside or outside the class.
class Car {
  public make: string;

  // Constructor assigns the car's make.
  constructor(make: string) {
    this.make = make;
  }
}

const myCar = new Car("Toyota");
console.log(myCar.make); // Accessible directly

// ✅ Private
// Private members are only accessible within the class itself.
class BankAccount {
  private balance: number = 0;

  // deposit() adds money to the account.
  deposit(amount: number) {
    this.balance += amount;
  }

  // getBalance() returns the current balance.
  getBalance(): number {
    return this.balance;
  }
}

const account = new BankAccount();
account.deposit(500);
console.log(account.getBalance()); // 500
// account.balance = 1000; ❌ Error: 'balance' is private

// ✅ Protected
// Protected members are accessible within the class and its subclasses.
class Employee {
  protected id: number;

  // Constructor sets the employee ID.
  constructor(id: number) {
    this.id = id;
  }
}

class Manager extends Employee {
  // showId() demonstrates access to protected member from subclass.
  showId() {
    console.log(`Manager ID: ${this.id}`);
  }
}

const mgr = new Manager(101);
mgr.showId(); // Manager ID: 101
// mgr.id ❌ Error: 'id' is protected

// ✅ Readonly
// Readonly properties can be assigned once and cannot be changed afterward.
class Config {
  readonly version: string = "1.0.0";

  // Constructor could also initialize readonly properties.
  // constructor(version: string) {
  //   this.version = version;
  // }
}

const cfg = new Config();
// cfg.version = "2.0.0"; ❌ Error: Cannot assign to 'version'

// ✅ Static
// Static members belong to the class itself, not to instances.
class MathUtils {
  static PI = 3.14;

  // square() returns the square of a number.
  static square(x: number): number {
    return x * x;
  }
}

console.log(MathUtils.PI);       // 3.14
console.log(MathUtils.square(5)); // 25

// ✅ Encapsulation
// Encapsulation is the principle of hiding internal state and exposing only necessary behavior.
// Achieved using private/protected members and public methods like getters/setters.

class UserProfile {
  private password: string;

  constructor(private username: string, password: string) {
    this.password = password;
  }

  // changePassword() allows controlled modification of the password.
  changePassword(newPassword: string) {
    this.password = newPassword;
  }

  // getUsername() exposes the username safely.
  getUsername(): string {
    return this.username;
  }
}

const user = new UserProfile("coder123", "secret");
console.log(user.getUsername()); // coder123
user.changePassword("newSecret");

// ===============================
// ❓ Trick Questions
// ===============================
// - Can you access private members outside the class? ❌ No.
// - Can static methods access instance members? ❌ No—they lack access to 'this'.
// - Can readonly properties be changed after construction? ❌ No.
// - Can protected members be accessed from outside the class hierarchy? ❌ No.
