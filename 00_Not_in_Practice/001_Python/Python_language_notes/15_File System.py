import os
import shelve
import shutil
# import send2trash


def printings():
    print("Main folder path : ", mainPath1)
    print(folders)
    print("folder 1 path : ", folder1)
    print("folder 2 path : ", folder2)
    print("file 1 path : ", file1)
    print("directory: ", os.path.dirname(file1))
    print("filename: ", os.path.basename(file1))
    print(os.path.exists(folder1))
    print(os.path.isfile(file1))
    print(os.path.isdir(folder1))
    print(os.path.getsize(file1))
    print(os.listdir(mainPath1))

    '''
    used this inside python shell
    import os
    os.getcwd()
    os.chdir("c:\\") ==> etc to get to directory where you want to work

    '''


mainPath1 = r'C:\Learning\Python\Python_language_notes\FileSystemDB'
# mainPath = 'C:\\Learning\\Python\\Python_language_notes\\FileSystemDB' another way to define path
folders = ['folder1', 'folder2', 'folder3']
files = ['data.txt']
folder1 = os.path.join(mainPath1, folders[0])
file1 = os.path.join(mainPath1, folders[0], files[0])
folder2 = mainPath1 + "\\" + folders[1]
if os.path.isdir(os.path.join(mainPath1, folders[2])):
    if len(list(os.listdir(os.path.join(mainPath1, folders[2])))) == 0:
        os.removedirs(os.path.join(mainPath1, folders[2]))  # prevent deleting if not empty
os.makedirs(os.path.join(mainPath1, folders[2]), exist_ok="NA")


# binary file is machine code file example .exe or .msi
# plain text file is a .txt file which has nothing but texts opens in notepad, word, etc.


def binary_plaintext_files():
    # open file in write mode it starts with line 1 so everything written before is erased
    w_loadtextfile1 = open(file1, 'w')
    w_loadtextfile1.write("\nthis is wrtie function")
    w_loadtextfile1.close()

    # open file in append mode cannot read here just append
    a_loadtextfile1 = open(file1, 'a')
    a_loadtextfile1.write("\nnew one")
    a_loadtextfile1.close()

    # open a file in read mode
    r_loadtextfile1 = open(file1)
    print(r_loadtextfile1.read())
    r_loadtextfile1.close()

    # to store non text data like dictionary list etc.
    print(os.getcwd())
    os.chdir(os.path.dirname(folder2))
    print(os.getcwd())
    shelffile = shelve.open('mydata')
    shelffile['new'] = ['this data', 'that data', 'what data']
    print(shelffile['new'], shelffile['dogs'])
    shelffile["dogs"] = ['husky', 'pug', 'Corgi']
    print(list(shelffile.keys()))
    print(list(shelffile.values()))
    shelffile.close()


def working_with_text_files():
    # copy file to diff location
    shutil.copy(file1, folder2)
    shutil.move(os.path.join(mainPath1, folders[1], "data.txt"), os.path.join(mainPath1, folders[2]))
    shutil.move(os.path.join(mainPath1, folders[2], "data.txt"), os.path.join(mainPath1, folders[2], "renamedf.txt"))
    shutil.copy(os.path.join(mainPath1, folders[2], "renamedf.txt"), os.path.join(mainPath1, folders[1]))
    os.unlink(os.path.join(mainPath1, folders[2], "renamedf.txt"))
    shutil.rmtree(folder2)  # deletes everything regardless of its size or quantity or Importance
#    print(os.path.join(mainPath1, folders[2], "renamedf.txt"))

# debug step by step to get understand what is happening
# binary_plaintext_files()

'''
os.makedirs(folder2)
if os.path.isfile(os.path.join(mainPath1, folders[0], "totrash.html")):
    print("file exists")
else:
    open(os.path.join(mainPath1, folders[0], "totrash.html"), 'w').write("hi")

send2trash.send2trash(os.path.join(mainPath1, folders[0], "totrash.html"))
working_with_text_files()
'''


def walking_directory():
    for foldername,subfolders,filenames in os.walk(mainPath1):
        print("Current folder name : ", foldername)
        print("folders inside " + foldername + " are : " + str(subfolders))
        print("files inside " + foldername + " are : " + str(filenames))
        for subfolders in subfolders:
            print(str(subfolders)+" ==> can perform action here")

        for file in filenames:
            print(str(filenames)+" ==> will be removed")
        print("")

walking_directory()