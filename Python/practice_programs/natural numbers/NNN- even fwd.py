#to print first n even natural numbers

u=int(input("enter number : "))
i=2
for j in range(1,u+1):
    print(i,end=" ") if u%2==0 else print(end="")
    i=i+2
