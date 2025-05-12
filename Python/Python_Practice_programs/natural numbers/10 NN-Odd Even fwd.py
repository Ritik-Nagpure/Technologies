#to print first 10 odd natural numbers and even natural numbers

print('first 10 odd natural numbers  are : ')
for i in range(1,20,2):
    print(i,end=" ")
    i=i+2
    
print('\nfirst 10 even natural numbers are : ')
for i in range(2,21):
    print(i,end=" ") if i%2==0 else print(end="")
