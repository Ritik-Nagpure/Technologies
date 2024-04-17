a = int(input("enter number to create table:\n"))
b = []
c = 1
while c != 11:
    b.append(c)
    c += 1

for x in b:
    print(a, " * ", b[x-1], " = ", a * b[x-1])

# second or main method for 'for' loops
print("\nnew\n")
for x in range(1, 11):
    print(a, " * ", x, " = ", a * x)
