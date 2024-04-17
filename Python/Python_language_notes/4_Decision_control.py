# if statement
a = int(input("Enter a number :\n"))
if a < 18:
    print("you are a minor")

# if else statement
a = int(input("Enter a number to evaluate even/odd :\n"))
if a % 2 == 0:
    print("Even")
else:
    print("Odd")

# Elif statement
a = int(input("enter you score "))
if a < 35:
    print("Failed")
elif a >= 35 & a < 75:
    print("passed")
elif a >= 75 & a < 90:
    print("passed with Distinction")
else:
    print("Merit")
