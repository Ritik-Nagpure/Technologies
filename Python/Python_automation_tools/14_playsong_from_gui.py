import pyautogui
import webbrowser
import time

def skipadd():
    cmpimg = r'C:\Learning\Python\Python_automation_tools\00_Screenshots\skipadd.png'
    cords = pyautogui.locateCenterOnScreen(cmpimg)
    if cords == None:
        cords = (1813, 748)
    return cords


def firstvideoclick():
    time.sleep(3)
    pyautogui.moveTo(610, 425)
    pyautogui.click()
    time.sleep(7)
    coords = skipadd()
    print(coords)
    pyautogui.moveTo(coords, duration=2)
    pyautogui.click()


def playsong(song):
    site = 'https://www.youtube.com/results?search_query='
    webbrowser.open(site + song)
    firstvideoclick()
    print(pyautogui.position())


def new(var):
    pyautogui.moveTo(686, 145)
    pyautogui.click()
    time.sleep(3)
    pyautogui.hotkey('ctrl', 'a')
    pyautogui.hotkey('del')
    pyautogui.typewrite(var)
    time.sleep(3)
    pyautogui.moveTo(1409, 148)
    pyautogui.click()
    firstvideoclick()


try:
    playsong('informer')
    var = 'Pink Blue x Saude Baazi - Mega Mashup (Gravero x @SushYohanMusic )'
    time.sleep(40)
    new(var)
except Exception as e:
    print(e)

    opt = webdriver.ChromeOptions()
    opt.add_argument("--start-maximized")
    opt.add_extension(r"C:\Users\RRNAGPUR\Documents\pyb\Certificate_Renewal_Bot\Certificate_Renewal_Bot\Python bot\ppnbnpeolgkicgegkbkbjmhlideopiji.crx")
    driver = webdriver.Chrome(options=opt)