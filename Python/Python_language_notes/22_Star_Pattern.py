import math

n = 4

print('----------------  Right Angle Number Triangle Sequencial  ---------------------')
for i in range(1, n + 1):
    for j in range(1, i + 1):
        print(j, end="")
    print()

print('---------------- Inverted  Right Angle NumberTriangle Sequencial  ---------------------')
for i in range(0, n + 1):
    for j in range(1, n - i + 1):
        print(j, end="")
    print()

print('---------------- Number Triangle Sequencial  ---------------------')
for i in range(0, n + 1):
    print(" " * (n - i), end="")
    for j in range(1, (i * 2)):
        print(j, end="")
    print()

print('---------------- Inverted Number Triangle Sequencial ---------------------')

for i in range(0, n + 1):
    print(" " * i, end="")
    for j in range(1, (n - i) * 2):
        print(j, end="")
    print()

print('----------------- Number Triangle Reverse Sequencial --------------------')

for i in range(0, n + 1):
    print(" " * (n - i), end="")
    for j in range((n * 2) - 1, ((n * 2) - 1) - (2 * i - 1), -1):
        print(j, end="")
    print()

print('-----------------Inverted Number Triangle Reverse Sequencial --------------------')

for i in range(0, n + 1):
    print(" " * i, end="")
    for j in range(((n - i) * 2) - 1, 0, -1):
        print(j, end="")
    print()

print('----------------  Right Angle * Triangle Sequencial  ---------------------')
for i in range(1, n + 1):
    for j in range(1, i + 1):
        print("*", end="")
    print()

print('---------------- Inverted  Right Angle * Triangle Sequencial  ---------------------')
for i in range(0, n + 1):
    for j in range(1, n - i + 1):
        print("*", end="")
    print()

print('---------------- * Square  ---------------------')
for i in range(n):
    for j in range(n):
        print("*", end=" ")
    print()

print('---------------- * Rectangle  ---------------------')
for i in range(n):
    for j in range(n + round(n / 2)):
        print("*", end=" ")
    print()

print('--------------- * Triangle ----------------------')

for i in range(0, n + 1):
    print(" " * (n - i), end="")
    for j in range(1, i * 2):
        print("*", end="")
    print()

print('--------------- Inverted * Triangle ----------------------')

for i in range(0, n + 1):
    if i == n:
        print(" " * (i + 1), end="")
    else:
        print(" " * i, end="")
    for j in range(((n - i) * 2) - 1, 0, -1):
        print("*", end="")
    print()

print('--------------- * Diamond ----------------------')

fn = (n * 2) - 1
hn = round((fn / 2))

print('--------------- * Diamond [ Method 1 ] ----------------------')

for i in range(1, fn + 1):
    if i <= hn:
        print(" " * (hn - i), end="")
        for j in range(1, i * 2):
            print("*", end="")
        print()
    else:
        print(" " * (i - hn), end="")
        print("*" * (2 * (fn - i) + 1))

print('--------------- * Diamond [ Method 2 ] ----------------------')

for i in range(1, fn + 1):
    if i <= hn:
        print(" " * (hn - i), end="")
        print("*" * (2 * i - 1))
    else:
        print(" " * (i - hn), end="")
        print("*" * (2 * (fn - i) + 1))

print('--------------- * Diamond [ Method 3 ] ----------------------')

for i in range(0, n + 1):
    print(" " * (n - i), end="")
    for j in range(1, i * 2):
        print("*", end="")
    print()

for i in range(0, n):
    print(" " * (i + 1), end="")
    for j in range(((n - i - 1) * 2) - 1, 0, -1):
        print("*", end="")
    print()

print(' ----------------------- Circle Pattern -------------------------- ')


def print_circle(r):
    for y in range(-r, r + 1):
        for x in range(-r, r + 1):
            if math.isclose(x ** 2 + y ** 2, r ** 2, abs_tol=max(1, r * 0.25)):  # Adjust tolerance for small n
                print("*", end=" ")
            else:
                print(" ", end=" ")
        print()


print_circle(5)
print_circle(5)
print_circle(4)
