# Working with tuples
# A tuple is a collection of objects which ordered and immutable.
# Tuples are sequences, just like lists.
# the tuples cannot be changed unlike lists and tuples use parentheses, whereas lists use square brackets.


def tuples():
    tup1 = ()
    tup2 = (50) # ',' is imp after value if not present it is not tuple
    tup3 = (50,) # ',' is imp after value if not present it is not tuple
    tup4 = (12,45,64, 'chem','phys','math')
    print(type(tup1), tup1)
    print(type(tup2), tup2)
    print(type(tup3), tup3)

    addtup  = tup1 + tup3 + tup4  # + tup2  ==> not possible as it is int not tuple
    print(addtup)
    print(addtup[0:4])  # access values like array or list
    del tup2  # to delete a tuple

    try:
        tup1[0] = 23  # not valid operation as tuple is immutable
    except Exception:
        print(tup1 , "invalid operation of assignment")


# Working with Sets
# Sets are used to store multiple items in a single variable.
# Set is one of 4 built-in data types in Python used to store collections of data,
# the other 3 are List, Tuple, and Dictionary, all with different qualities and usage.
# A set is a collection which is unordered, unchangeable*, and unindexed.

def sets():
    # thisset = {"apple", "banana", "cherry","apple", 1, True, 2}
    thisset = set(("apple", "banana", "cherry","apple", 1, True, 2))
    print(thisset)
    print(type(thisset))
    print(len(thisset))


sets()


'''
There are four collection data types in the Python programming language:
    List is a collection which is ordered and changeable. Allows duplicate members.
    Tuple is a collection which is ordered and unchangeable. Allows duplicate members.
    Set is a collection which is unordered, unchangeable*, and unindexed. No duplicate members.
    Dictionary is a collection which is ordered** and changeable. No duplicate members.
'''