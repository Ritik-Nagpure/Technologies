b = 1
a = int(input("enter number to create table:\n"))

while True:
    print(a, " * ", b, " = ", a * b)
    b += 1
    if b == 11:
        break