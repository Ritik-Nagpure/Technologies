#to find prime number
x=int(input('enter number : '))
if x<2:
    print("x is not a prime number")
else: 
    for i in range(2,x):
        if x%i==0:
            print("x is not a prime number")
            break
    else:
        print("x is a prime number")
