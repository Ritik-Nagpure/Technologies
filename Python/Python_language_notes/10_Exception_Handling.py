def div(arg1):
    try:
        a = 92/arg1
        return a
    except ZeroDivisionError:
        return "Cannot divide by zero"

a = 92/0

print(div(4))
print(div(42))
print(div(-5))
print(div(0))
print(div(-0.5))

