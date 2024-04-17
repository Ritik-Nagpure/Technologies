import requests
import os

filedir = str(os.getcwd()) + "\\00_Downloads"
os.chdir(filedir)
print(os.getcwd())
dlink = 'https://automatetheboringstuff.com/files/rj.txt'


# making a get request
def download(dllink):
    try:
        res = requests.get(dllink)
        res.raise_for_status()  # ==> raise exception if *error occurred.
        print(res.status_code)
        if res.ok:
            print('Downloading successfully started')
        # print(res.text)
        playfile = open('romeo.txt', 'wb')
        for chunk in res.iter_content():
            playfile.write(chunk)
        print('created romeo.txt file at : ', os.getcwd())
        playfile.close()
    except Exception as e:
        print(e)


# download(dlink)


# making  a post request o teams channel
def teams(p_url, jmsge):
    try:
        res = requests.post(p_url, json=jmsge, timeout=5)
        print(res.status_code, res.text)
        if res.ok:
            print('successfull')
    except Exception as e:
        print(e)


url = 'https://capgemini.webhook.office.com/webhookb2/0c91a981-b5ec-43a7-b511-19570c4942d6@76a2ae5a-9f' \
      '00-4f6b-95ed-5d33d77c4d61/IncomingWebhook/30ae9cf49bca4dec90ad51b0e4e821a0/cc8a38cd-38bb-452a-85' \
      '52-c8f8a8c87857'
msge = {'text': 'This post was sent to test py requests module'}

#teams(url, msge)
