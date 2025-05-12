#to print first n even natural numbers in reverrse

x=int(input("enter number : "))
u=2*x
for i in range(1,x+1):
    print(u,end=" ") if u%2==0 else print(end="")
    u=u-2
