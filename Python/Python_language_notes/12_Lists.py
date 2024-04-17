# creating a List
newlist = ['cat', 'rat', 'mat', 'bat', 'hat', 'dog', 'elephant', 'hooman', 'corgi', 'husky', 3, 45, 345, 24, ]


def createlist1(newlist):
    print(newlist)
    print(newlist[3:7])
    print(newlist[4])
    print(newlist[6][3:7])


# list inside a list
list1 = [['cat', 'bat', 'rat'], ['dog', 'elephant', 'hooman'], ['corgi', 'husky'], 'pug', [2, 5, 78, 9, ], 5, 78, 5775]


def createlist2(list1):
    print(list1)
    print(list1[1])
    print(list1[2:5])
    print(list1[3])
    print(list1[1][2], list1[3][2], list1[0][1])
    print(list1[4][1:], list1[7], list1[4][:3])
    return list1


def listoperations(list1, newlist):
    listgrt = list1 + newlist
    print(listgrt)

    mullist = list1[2] * 3
    print(mullist)

    # divlist = newlist / list1  ==> doesn't work
    # print(divlist)

    mullist += ['hi', 'hello']
    print(mullist)
    print(mullist[len(mullist) - 1][0][0])


def listwithloops():
    '''
    for i in range(1, 11):
        print(i)
    '''
    for i in range(len(newlist)):
        print("Index " + str(i) + " has value : ", newlist[i])


dog = [['Husky', 'Corgi', 'Labrador', 'Pug', 'Border Collie'], ['Medium', 'Large''Small'],
       ['Domestic', 'Wild', 'Hunter', 'Toy'], ['Golden', 'White', 'Black', 'Brown', 'Fawn']]


def listassignments(dogdetails):
    Breed, Size, Nature, Color = dogdetails
    print(Breed)
    print(Size)
    print(Color)
    print(Nature)
    for i in range(len(dog) - 2):
        for j in range(len(Breed) - 2):
            for k in range(len(Color) - 3):
                print("you can have a ", Breed[j], Color[k])


anewlist = ['hi', 'hello', 'hey', 'heya', 'namaste', 'namaskaram', 'naman']


def listmethods(alist):
    print(alist)
    alist.append('namaskar')  # add value at the end of list
    print(alist)
    print(alist.index('hi'))
#    print(alist.index('ola')) # ==> throws error as 'ola' is not list element
    print(alist.index('namaskar'))
#    print(alist.insert())
    alist.insert(3,'ola')
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

# call function to run
listmethods(anewlist)
listassignments(dog)