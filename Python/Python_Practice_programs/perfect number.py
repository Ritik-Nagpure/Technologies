while(True):
    low=int(input("enter low "))
    high=int(input("enter high "))

    if(low<high):
        for i in range(low,high+1):
            fact=0
            for j in range(1,i):
                if(i%j==0):
                    fact+=j
            if(fact==i):
                print("perfect number is: ",i)
    else:
        print("invalid input")

        
