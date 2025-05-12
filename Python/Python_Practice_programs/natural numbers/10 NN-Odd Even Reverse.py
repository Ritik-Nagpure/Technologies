#to print first 10 odd natural numbers and even natural numbers reverrse

print('first 10 odd natural numbers in reverse are : ')
s=19
for i in range(1,20,2):
    print(s,end=" ")
    s=s-2
    
print('\nfirst 10 even natural numbers in reverse are : ')
u=20
for i in range(1,11):
    print(u,end=" ") if u%2==0 else print(end="")
    u=u-2
