# usign beautifulsoup4 Module
import bs4
import requests

url_w3s = 'https://www.amazon.in'

try:

    res = requests.get(url_w3s)
    res.raise_for_status()
    # print(res.status_code)
    soup = bs4.BeautifulSoup(res.text, 'html.parser')
    selt = '#nav-xshop > a:nth-child(2)'  # get this from inspect ->copy-> copy selector to element required
    a = soup.select(selt)
    print(a[0].text)
except Exception as e:
    print(e)
