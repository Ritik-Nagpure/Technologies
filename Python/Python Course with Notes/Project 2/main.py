import random
randNumber = random.randint(1, 100)
print(randNumber)
userGuess = None
guesses = 0

while(userGuess != randNumber):
    userGuess = int(input("Enter your guess: "))
    guesses += 1
    if(userGuess==randNumber):
        print("You guessed it right!")
    else:
        if(userGuess>randNumber):
            print("You guessed it wrong! Enter a smaller number")
        else:
            print("You guessed it wrong! Enter a larger number")

print(f"You guessed the number in {guesses} guesses")
with open("G:\\Python\\Python Course with Notes\\Project 2\\hiscore.txt", "r") as f:
    hiscore = int(f.read())

if(guesses<hiscore):
    print("You have just broken the high score!")
    print(f"Your new high score is {guesses} ")
    with open("G:\\Python\\Python Course with Notes\\Project 2\\hiscore.txt", "w") as f:
        f.write(str(guesses))