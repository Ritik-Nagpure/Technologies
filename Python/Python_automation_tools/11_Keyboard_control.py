import pyautogui

'''



'''
var = 'Pink Blue x Saude Baazi - Mega Mashup (Gravero x @SushYohanMusic )'
pyautogui.moveTo(604, 270, duration=2)
pyautogui.click()

pyautogui.typewrite(var)

for i in range(0, 15):
    pyautogui.press('backspace')

pyautogui.hotkey('ctrl', 'a')
pyautogui.hotkey('del')
# to get all keys KEYBOARD_KEYS
