import pyautogui

width, height = pyautogui.size()
print(width, height)
p = pyautogui.position()
print(p)
# pyautogui.moveTo(600,400, duration = 2)
# pyautogui.displayMousePosition() ==> to get realtime mouse position
pyautogui.moveTo(1919,1078, duration = 3)
pyautogui.click()
pyautogui.moveTo(100,200, duration = 5)
pyautogui.doubleClick()
