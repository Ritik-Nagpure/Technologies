# built-in function examples
import random
import sys
import pyperclip as py


a = random.randint(1, 99)
print(a)


# import third party modules using pip command

py.copy("this was copied")
py.paste()

# exits the terminal nothing written after it is executed
# sys.exit()

# Variable scope
# global variable ==> whose scope is entire code it is declared after import
# or with same indentation as import. it is accessible inside all class, functions or methods
# where it is called. it has no scope outside the script/python file where it was declared

# local variable ==> whose scope is specific to the function or method where is defined. it can
# be accessible to all methods which are inside the same function but is not outside that function.


def square(arg1):
    b = arg1+2
    print(b*b)
    return arg1*arg1


a = int(input("enter a number to evaluate square:\n"))  # a=> global scope;also used inside function
c = square(a)
print(c)
# print(b)  # b ==> local scope in function only outside it throws error

