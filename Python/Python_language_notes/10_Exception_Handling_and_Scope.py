# Error Handling is for handling unwanted error that can occur during runtime.
# This is achieved using try, except and finally statement.
# code to be executed is placed inside try.
# if any error is thrown then except is ran with ignore the output of statements inside try block.
# once try-except is completed finally statement is ran. this is optional and run compulsorily at the end if present.
# Else statement runs only when try block is successful.

b = 45  # GLOBAL Scope ==> This has global scope which means it is available in entire file.


def div(arg1):
    a = 0  # Local Scope ==>  This has local scope and is not available outside the funtion.
    try:  # Code block here
        a = 92 / arg1
        print(b)  # printing var from outside the function
        if a % 2 == 0:
            raise Exception("This is a EVEN number that you have entered.")
    except ZeroDivisionError:
        return "Cannot divide by zero"
    except TypeError:  # catching/handling multiple errors is possible with multiple except statements
        return "value not acceptable"
    except Exception as excep:  # Adding General/Generic exception handler
        print("New Exception is thrown : " + str(excep))
    else:
        print("Execution completed succesfully.")
        return a
    finally:  # Finally Statement
        print(f"Instance ended for {arg1}")


# print(a)  # var from inside the function is not available outside, thus shows error for a


print(div(4))
print(div(42))
print(div(-5))
print(div(0))
print(div(-0.5))
print(div("na"))
