'''
A lambda function is a small anonymous function.
A lambda function can take any number of arguments, but can only have one expression.
'''

# The expression is executed and the result is returned:
x = lambda a: a + 10
print(x(5))

# Lambda functions can take any number of arguments:

x = lambda a, b: a * b
print(x(5, 6))


# Python does not have built-in support for Arrays, but Python Lists can be used instead.
# so all list functionalities can be applied here but as per defination it can't be of same dataype
# to maintain its definition(of same datatype) value should be verified before it is appended

cars = ["Ford", "Volvo", "BMW"]
print(cars)
print(cars[1])
