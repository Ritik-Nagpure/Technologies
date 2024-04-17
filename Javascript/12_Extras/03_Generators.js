

// Can create something while running thereby minimising the effor of creating and storing a var
// create OTP as generator 

function* createotp(n) {
    while(true){
        let otp = "";
        for (let i = 0; i < n; i++) {
            otp += Math.floor(Math.random() * 10);
        }
        yield otp;
    }
}

let otp = createotp(6);
console.log(otp.next());
console.log(otp.next());
console.log(otp.next());
console.log(otp.next());
console.log(otp.next());
