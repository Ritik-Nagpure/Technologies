import webbrowser


def searchcar(name):
    # to open an url in web browser
    link = "https://en.wikipedia.org/wiki/" + name
    webbrowser.open(link)


def searchmap(name):
    # to open an url in web browser
    link = "https://www.google.com/maps/search/" + name
    webbrowser.open(link)


#searchcar("Abarth")
#searchmap('Macdonalds')
#searchmap('KFC')

