interface UserDetails {
    id: number
    name: string
    age: number
}

interface Prototype {
    clone(): Prototype
    getUserDetails(): UserDetails
}

class ConcretePrototype implements Prototype {
    private user: UserDetails;

    constructor(user: UserDetails) { }

    public clone(): Prototype {
        const clone = Object.create(this)
        clone.user = { ...this.user }
        return clone
    }

    public getUserDetails(): UserDetails {
        return this.user
    }
}

const userdata = {
    id: 2,
    name: 'pankaj',
    age: 23
}

console.log(userdata);

let user1 = new ConcretePrototype(userdata)
let user2 = user1.clone()

let u1d = user1.getUserDetails()
console.log(u1d)

console.log(user2.getUserDetails());
console.log(user1 === user2);
