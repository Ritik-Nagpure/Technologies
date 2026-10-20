import copy
import string


def main():
    str1 = 'Hello'
    print(list(str1))
    # string is a type of list or array of characters
    # all list methods are applicable to string
    # strings in python are immutable so str1[4] = 'u' won't work

    lee1 = [1, 2, 3, 4, 5, 6, 7]
    lee2 = lee1
    print('list 2: ', lee2)
    print('list 1 : ', lee1)
    lee2[2] = 'hello'
    # no changes where made to list 1 but it has same changes as list 2 because in python list can never
    # be variable it is creating somewhere in memory and its reference address is stored in variable we
    # create. hence while copying we copy reference and changes are done to list eventually to variable
    # who refers to that list will show changes and this may create a bug in application
    print('list 2: ', lee2)
    print('list 1 : ', lee1)

    print("************************************")
    # to rectify this we can use deepcopy as below which will create a new list which has exactly same
    # elemnts as the sourse and willgive its reference to new variable where we assigned new list.
    lee1 = [1, 2, 3, 4, 5, 6, 7]
    lee2 = copy.deepcopy(lee1)
    print('list 2: ', lee2)
    print('list 1 : ', lee1)
    lee2[2] = 'hello'
    print('list 2: ', lee2)
    print('list 1 : ', lee1)

    # to ignore the indentation
    print("****************** new " + \
          "*****************")
    # More about Strings
    # escape character and ' or " quote in same string
    print("Shena is Alice's Mother")
    print(('Rohan said "Shena is Mother to Alice"'))
    print('Shena is Alice\'s Mother')  # ignore next char in this case ==>  '
    print('Hello\nHow are you?')  # new line
    print("Well Hello Mr...\tFakir")  # give Tab or long space
    print("hello Tea\\Coffee ?")  # ignore next \ here

    # raw string
    # to add \ or escape chars in string directly || useful in providing address/location in system
    print(r'c:\user\me\you\what')

    # multiline input string
    print("""Dear Alice,
    Eve's cat has been arrested for catnapping, cat burglary
    and extortion.
    Sincerely,
    Bob. """)


def StringMethods():
    str1 = "Hello World!! "
    str2 = "Its Alice"
    print(str1,str2)
    print(str1 + str2)
    res = input("Do you want me to repeat?")
    if res.islower():
        if res == 'yes':
            print('Sure')
    else:
        if res.lower() == 'yes':
            print('Why not')
        print("Bhag B...")


StringMethods()