import pyautogui
import os


ssfolder = os.getcwd() + "\\00_Screenshots\\"
os.chdir(ssfolder)
# print(os.getcwd())
num = 1
ss = ssfolder + "ss" + str(num) + ".png"
sam = ssfolder + "sample.png"
print(sam)

# pyautogui.screenshot(ss)
print(pyautogui.locateOnScreen(sam))
print(pyautogui.locateCenterOnScreen(sam))
try:
    a = pyautogui.locateCenterOnScreen(sam)
    print(a)
    pyautogui.moveTo(a , duration = 2)
except Exception as e:
    print(e)




