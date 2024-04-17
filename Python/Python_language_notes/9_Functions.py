def newfunc(arg1):
    print("Evaluation starts....")
    a = 100 - arg1
    str1 = "you have " + str(a) + " years left in your life. \nStart Working !!!"
    print("Evaluation ends...")
    return str1


num = int(input("Enter new number:\n"))
ans = newfunc(num)
print(ans)
