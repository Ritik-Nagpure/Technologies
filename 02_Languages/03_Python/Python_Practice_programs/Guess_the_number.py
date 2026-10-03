import random
import sys


def guessinggame(number, a):
    for i in range(1, 5):
        g = 5-i
        if number == a:
            break
        else:
            val = ""
            if number > a:
                val = "High"
            elif number < a:
                val = "Low"
            print("your guess is ", val, " !! only ", g, " attempt remains. Try again.")
            number = int(input())
    if number != a:
        print("you lose")
    if number == a:
        print("you guessed it correct.\n")


name = input("What is your name ?\n")
response = input("Hello " + name + "!\nWould you like to play a game with me?\nIts called Guess the number !!\n")

while True:
    if response.lower() == "yes":
        ansint = random.randint(1, 20)
        print(ansint)
        num = int(input("Guess my Number in 5 chance. its between 1 and 10.\n"))
        guessinggame(num , ansint)
    elif response.lower() == "no":
        sys.exit()
    else:
        print("I don't understand!\t Yes or No ?\n")
    response = input("Do you want to continue?")
