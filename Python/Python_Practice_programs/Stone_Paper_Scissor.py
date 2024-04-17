import random
import sys


def getuserans():
    num = int(input("Chose your hand (enter numeric) :\n1] Stone\n2] Paper\n3] Scissor\nAns: "))
    if num == 1:
        userans = "Stone"
    elif num == 2:
        userans = "Paper"
    elif num == 3:
        userans = "Scissor"
    else:
        userans = ""
        print("invalid ans !!")
    return userans


def sps(comp, userans):
    print("Computer choose ", comp)
    print("You choose", userans)
    if (comp == "Stone") & (userans == "Paper"):
        print("*********\n     You Won\n************")
    elif (comp == "Paper") & (userans == "Scissor"):
        print("*********\n    You Won\n************")
    elif (comp == "Scissor") & (userans == "Stone"):
        print("*********\n     You Won\n************")
    elif comp == userans:
        print("*********\n     Draw\n************")
    else:
        print("*********\n    You Lose\n************")


name = input("What is your name ?\n")
response = input("Hello " + name + "!\n Would you like to play a stone paper scissor with me?\n")

while True:
    if response.lower() == "yes":
        listans = ["Stone", "Paper", "Scissor"]
        compans = random.choice(listans)
        ans = getuserans()
        sps(compans, ans)
    elif response.lower() == "no":
        sys.exit()
    else:
        print("I don't understand!\t Yes or No ?\n")
    response = input("Do you want to continue?")
