# Modules are the python scripts which have some functions or set of instructions.
# it can be imported and used in other python scripts.
import a_example_module as modex

# calling a function from  a_example_module python file
modex.modprint()

# calling with parameters
b = modex.modadd([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
print(b)

# printing  all functions inside a library
print(dir(modex))
# module is imported as modex to get its actual name you can use
print(modex.__name__)

# Built-in Modules Ex. Math
# Python has a set of built-in math functions, including an extensive math module,
# that allows you to perform mathematical tasks on numbers.
import math

print(pow(5, 3))  # ==> give pow(x,y) gives x to the power y
print(min(5, 3, 6, 8, 2))  # ==> gives minimum value of
print(max(5, 3, 6, 8, 2))  # ==> gives maximum value of
print(abs(-7.25))  # ==> gives absolute value
print(math.sqrt(64))  # ==> gives square root
print(math.ceil(1.4))  # ==> rounds a no. upwards to its nearest integer
print(math.floor(1.4))  # ==> rounds a no. downwards to its nearest integer
print(math.pi)  # ==> print value of pi
print(round(math.pi))  # ==> print round of value for pi
