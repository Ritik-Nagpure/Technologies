from selenium import webdriver
import time

try:
    browser = webdriver.Firefox()
    site = 'https://automatetheboringstuff.com/'
    song = 'con+calma'
    # song = input()
    browser.get(site)
    # time.sleep(3)
    browser.fullscreen_window()
    elem = browser.find_element("p")
    print(len(elem))
    browser.refresh()
    browser.quit()
except Exception as e:
    print(e)
