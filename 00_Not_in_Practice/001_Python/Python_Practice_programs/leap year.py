
while 1:
    x=int(input("enter year : "))
    if x%400==0:
        print(x," is leap year\n")
    elif x%4==0 and x%100!=0:
        print(x," is leap year\n")
    else:
        print(x," is not a leap year\n")

#simpleir 1 line code

# result='leap year' if x%400==0 else 'leap year' if x%4==0 and x%100!=0:  else 'not leap year'
# print(result)
