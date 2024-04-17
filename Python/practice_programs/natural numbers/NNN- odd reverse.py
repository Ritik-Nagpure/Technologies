#to print n odd natural numbers in reverse

s=int(input("enter number : "))
o=2*s-1
for i in range(0,s):
    print(o,end=" ")
    o=o-2
