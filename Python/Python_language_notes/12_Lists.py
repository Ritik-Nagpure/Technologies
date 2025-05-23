from functools import reduce

# creating a List
newlist = ['cat', 'rat', 'mat', 'bat', 'hat', 'dog', 'elephant', 'hooman', 'corgi', 'husky', 3, 45, 345, 24]
anewlist = ['hi', 'hello', 'hey', 'heya', 'namaste', 'namaskaram', 'naman']
dog = [['Husky', 'Corgi', 'Labrador', 'Pug', 'Border Collie'], ['Medium', 'Large''Small'],
       ['Domestic', 'Wild', 'Hunter', 'Toy'], ['Golden', 'White', 'Black', 'Brown', 'Fawn']]
intlist = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
# list inside a list
list1 = [['cat', 'bat', 'rat'], ['dog', 'elephant', 'hooman'], ['corgi', 'husky'], 'pug', [2, 5, 78, 9, ], 5, 78, 5775]


def createlist1(li):
    print(li)
    print(li[3:7])
    print(li[4])
    print(li[6][3:7])


def createlist2(li):
    print(li)
    print(li[1])
    print(li[2:5])
    print(li[3])
    print(li[1][2], li[3][2], li[0][1])
    print(li[4][1:], li[7], li[4][:3])
    return li


def listoperations(li1, li2):
    listgrt = li1 + li2
    print(listgrt)

    mullist = li1[2] * 3
    print(mullist)

    # divlist = newlist / list1  ==> doesn't work
    # print(divlist)

    mullist += ['hi', 'hello']
    print(mullist)
    print(mullist[len(mullist) - 1][0][0])


def listwithloops():
    for i in range(len(newlist)):
        print("Index " + str(i) + " has value : ", newlist[i])

    for i in dog:  # to access values directly / iterate through each value
        print(i)


def listassignments(dogdetails):
    breed, size, nature, color = dogdetails
    print(breed)
    print(size)
    print(color)
    print(nature)
    for i in range(len(dog) - 2):
        for j in range(len(breed) - 2):
            for k in range(len(color) - 3):
                print("you can have a ", breed[j], color[k])


def listmethods(alist):
    print(alist)
    alist.append('namaskar')  # add value at the end of list
    print(alist)
    print(alist.index('hi'))
    #    print(alist.index('ola')) # ==> throws error as 'ola' is not list element
    print(alist.index('namaskar'))
    #    print(alist.insert())
    alist.insert(3, 'ola')
    print(alist)
    alist.remove('namaste')
    print(alist)
    del alist[5]
    print(alist)
    del alist[:2]
    print(alist)
    # cannot sort combinations like a list of int nd float or float and string etc
    # Sorting occurs based on ASCII values not other
    alist.sort()
    print(alist)
    alist.sort(reverse=True)
    print(alist)


def listfunctions(li1, inlist):
    def square(n):
        return n ** 2

    # Join fucntion on list
    # It converts all values into a single string with values seperated by defined string before join
    print(' ; '.join(li1))

    # Map function
    # used to operate on each value of a list with a function
    list_square = list(map(square, inlist))
    print(list_square)

    # Filter a list based on any function it can be a lambda function also as in below
    def getodd(x):
        return x % 2 != 0

    even_squares = list(filter(lambda x: x % 2 == 0, list_square))
    odd_squares = list(filter(getodd, list_square))
    print(even_squares)
    print(odd_squares)

    # Reduce is used to apply a function cumulatively to items in an iterable, reducing it to a single value.
    # It’s part of the functools module.
    reduced_list = reduce(lambda x, y: x + y, list_square)
    print(reduced_list)

    # Enumerate
    # he enumerate() function in Python is used to loop over an iterable while keeping track of the index of each item.
    # It returns both the index and the value in a tuple.
    for index, item in enumerate(list_square):
        print(f'{index} --> {item}')

    # Comprehension
    # A shorthand way to create lists using a single line.
    print([x**3 for x in range(10)])


# call function to run
# listmethods(anewlist)
# listassignments(dog)
listwithloops()
listfunctions(anewlist, intlist)
