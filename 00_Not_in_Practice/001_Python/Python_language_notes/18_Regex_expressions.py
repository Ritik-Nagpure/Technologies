import re

# check https://www.rexegg.com/regex-quickstart.html
message = 'Hello My name is Something. I am Something. ' \
          'you can call me on +91-987-868-5848 or +91-712-270-0847 to call me Something.'

Batmanstory = 'Bruce wayne aka Batman is a vigalanti. he apears in night just like a bat and people refer to him ' \
              'as Batman He carries Batmobile and sometime Batcopter. he uses Batblades to fight crime in Gotham.'

poem = "12 drummers drumming, 11 pipers piping, 10 lords a leaping, 9 ladies dancing, " \
       "8 maids a milking, 7 swans a swimming, 6 geese a laying, 5 golden rings, 4 calling" \
       " birds,3 french hens, 2 turtle doves, and 1 partridge in a pear tree"


def searchphone():
    getcontact = re.compile(r'\d\d-\d\d\d-\d\d\d-\d\d\d\d')  # ==> declare regex

    matchobject = getcontact.search(message)
    print(type(matchobject))
    print(matchobject)
    print(matchobject.group())
    print("")
    mof1 = getcontact.findall(message)
    print(type(mof1))
    print(mof1)


def batmanregex1():
    # batregex = re.compile(r'Bat(mobile|man|copter|bat|Bat)')
    batregex1 = re.compile(r'Bat(mobile|man|copter|blades)')
    newbatmo = batregex1.findall(Batmanstory)
    # newbatmoa = batregex1.search(Batmanstory[150:200])
    newbatmoa = batregex1.search(Batmanstory)
    print(newbatmo)
    print(newbatmoa)


def batmanregex2():
    batregex = re.compile(r'Bat(wo)*?man')
    mo = batregex.search('Adventures of Batman')
    print(mo)
    mo = batregex.search('Adventures of Batwowowowowoman')
    print(mo)


def alphs(poem):
    newstr = 'Robocop eats baby food'
    # extract all vowels
    vow = re.compile(r'[aeiouAEIOU]')
    print(vow.findall(newstr))
    # extract all except vowels
    vow = re.compile(r'[^aeiouAEIOU]')
    print(vow.findall(newstr))

    # extract string pattern
    pattern = re.compile(r'(\d+(\s\w+)*)')
    poemlines = pattern.findall(poem)
    print(poemlines)
    for i in range(0, len(poemlines)):
        print(poemlines[i][0])


'''
^<word> ==> to search at beginning
$<word> ==> to search at the end
.<word> ==> anything before the word is allowed to match subject to character count 1
'''


def extractnames():
    namestr = "First name: Ritik Last Name : Nagpure"
    namereg = re.compile(r'First name: (.*) Last Name : (.*)')
    name = namereg.findall(namestr)
    print(name)


extractnames()
