def box():
    x1 = 4
    x2 = 40
    y1 = 4
    y2 = 40
    return [x1, x2, y1, y2]


def get_cords():
    x = int(input("Enter X Co-ord : "))
    y = int(input("Enter Y Co-ord : "))
    return [x, y]


def check(u_coli, d_coli):
    if d_coli[0] < u_coli[0] < d_coli[1] and d_coli[2] < u_coli[1] < d_coli[3]:
        print("You are correct. This point is inside the box.")
    elif d_coli[0] < u_coli[0] < d_coli[1] and (u_coli[1] == d_coli[2] or u_coli[1] == d_coli[3]):
        print("You are correct. This point is on the box.")
    elif d_coli[2] < u_coli[1] < d_coli[3] and (u_coli[0] == d_coli[0] or u_coli[0] == d_coli[1]):
        print("You are correct. This point is on the box.")
    else:
        print("You are wrong. This point is not inside the box.")


def start_game():
    while True:
        try:
            uc = get_cords()
            dc = box()
            check(uc, dc)
        except Exception as e:
            print(e)


start_game()
