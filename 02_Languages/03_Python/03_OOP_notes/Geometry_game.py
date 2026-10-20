import time
import turtle


def box():
    x1 = 4
    x2 = 30
    y1 = 4
    y2 = 30
    return [x1, x2, y1, y2]


def get_cords():
    a = int(input("Enter X: "))
    b = int(input("Enter Y: "))
    return [a, b]


def check(u_coli, d_coli):
    if d_coli[0] < u_coli[0] < d_coli[1] and d_coli[2] < u_coli[1] < d_coli[3]:
        ans = "You are correct. This point is inside the box."
    elif d_coli[0] < u_coli[0] < d_coli[1] and (u_coli[1] == d_coli[2] or u_coli[1] == d_coli[3]):
        ans = "You are correct. This point is on the box."
    elif d_coli[2] < u_coli[1] < d_coli[3] and (u_coli[0] == d_coli[0] or u_coli[0] == d_coli[1]):
        ans = "You are correct. This point is on the box."
    else:
        ans = "You are wrong. This point is not inside the box."
    return ans


def createbox(d_coli):
    mt = turtle.Turtle()
    s1 = (d_coli[1] - d_coli[0]) * 10
    s2 = (d_coli[3] - d_coli[2]) * 10

    mt.hideturtle()
    mt.color("Green")
    mt.pensize(5)

    mt.penup()
    mt.color("Orange")
    mt.goto(-220, -80)
    # mt.dot()
    mt.goto((-220 + (d_coli[0] * 10)), (-80 + (d_coli[2] * 10)))
    # mt.dot()
    mt.pendown()

    mt.color("Green")
    mt.forward(s1)
    mt.left(90)
    mt.forward(s2)
    mt.left(90)
    mt.forward(s1)
    mt.left(90)
    mt.forward(s2)
    mt.left(90)


def markpoint(u_coli, ans):
    mt = turtle.Turtle()

    mt.hideturtle()
    mt.color("Red")
    mt.pensize(7)

    mt.penup()
    # mt.color("Orange")
    mt.goto(-220, -80)
    # mt.dot()
    mt.goto((-220 + (u_coli[0] * 10)), (-80 + (u_coli[1] * 10)))
    mt.dot()
    mt.goto(-220, -150 )
    mt.write(ans, font=("Arial", 20, "normal"))
    mt.pendown()



def start_game():
    while True:
        try:
            uc = get_cords()
            dc = box()
            ans = check(uc, dc)
            print(ans)
            time.sleep(3)
            turtle.getcanvas()
            createbox(dc)  # [4, 50, 50, 70]
            markpoint(uc, ans)  # [3, 7]
            turtle.done()
            turtle.exitonclick()
        except Exception as e:
            print(e)


start_game()
