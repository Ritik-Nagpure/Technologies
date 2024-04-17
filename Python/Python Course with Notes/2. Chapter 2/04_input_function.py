a = input("Enter a number: ")
try :
    a = int(a) # Convert a to an Integer(if possible)
except:
    print("exception caught")
finally: 
    print(type(a))