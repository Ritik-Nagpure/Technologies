# simple mail transfer protocol ==> SMTP
# to send email

import smtplib
import win32com.client as win32
import imapclient
import re
import pyzmail


from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase

user_var = 'ritik.r-nagpure@capgemini.com'
pass_var = 'Valardohaeris@1'  # ==> Email password
subject = "Pyhton bot SMTP test"
message = "Hi,\nThis mail is sent from Py Bot."

user_varg = 'ritiknagpure@gmail.com'
pass_varg = 'tknn uwoz alhq foif'


def send_email_using_smtplib():
    conn = smtplib.SMTP('smtp-mail.outlook.com', 587)
    print(type(conn))

    conn_res = conn.ehlo()
    if conn_res[0] == 250:
        print("Connection successful")

    conn_tls = conn.starttls()
    if conn_tls[0] == 220:
        print("TLS is Ready to start")

    conn_login = conn.login(user_var, pass_var)
    if conn_login[0] == 235:
        print("Login Succesfull")
    else:
        print("Login Failed")

    sendmail_res = conn.sendmail(user_var, user_var, ("Subject:" + subject + "\n\n" + message))
    if len(sendmail_res) == 0:
        print("Sent mail Successfully")

    conn_close = conn.quit()
    if conn_close[0] == 221:
        print("Connection closed successfully")


def send_email_using_outlook_app(to, subject1, body, cc):
    # Sending mail from Outlook. Here we are using win32,So we don't require to enter credentials
    # opening outlook application
    outlook = win32.Dispatch('outlook.application')
    # Creating new mail
    mail = outlook.CreateItem(0)

    # Assigning primary recipient for the mail
    mail.To = to
    # Assigning subject of the mail
    mail.Subject = subject1
    # Assigning mail body
    mail.HTMLBody = body
    # Adding CC
    # mail.Cc = cc
    # Sending the mail
    mail.SentOnBehalfOfName = user_var
    send_res = mail.Send()
    print(str(send_res))


def print_mail(UIDs, conn):
    num = 0
    for i in UIDs:
        Currmail = conn.fetch(UIDs[num], ['BODY[]', 'FLAGS'])
        # print(Currmail[UIDs[num]][b'BODY[]'])
        message = pyzmail.PyzMessage.factory(Currmail[UIDs[num]][b'BODY[]'])
        print("*******************")
        print(i)
        # print( str(message.text_part), str(message.text_part))
        print(pyzmail.generate.format_addresses([message.get_address('from')], 'From', 'us-ascii'))
        print(message.get_all('date')[0])
        print(message.get_subject())
        num += 1


def getFolderlist(conn):
    folderlist = conn.list_folders()
    # print(type(folderlist))
    n = 0
    for i in range(0, len(folderlist)):
        print(folderlist[i][2])


def interactgmail():
    conn = imapclient.IMAPClient('imap.gmail.com', 993, ssl=True)

    try:
        conn_login = conn.login(user_varg, pass_varg)
        conn_login = str(conn_login)
        regexlogin = re.compile(r'Success')
        mo = regexlogin.search(conn_login)
        if mo.group() == 'Success':
            print("Login Successfull")
    except Exception as e:
        print(e)

    conn.select_folder("INBOX", readonly=True)
    UIDs = conn.search(['SINCE', '04-May-2023'])

    # print(str(UIDs))
    print("*******************")
    print("Total number of mails Retrieved : ", len(UIDs))

    getFolderlist(conn)
    print_mail(UIDs, conn)
    print("*******************")
    conn.logout()

# send_email_using_smtplib()

# send_email_using_outlook_app(user_var, subject, message, "cc")

# interactgmail()



def send_email_using_smtplib_cg():
    conn = smtplib.SMTP('de-mucdssmtp01.corp.capgemini.com', 25)
    # print(type(conn))

    conn_res = conn.ehlo()
    if conn_res[0] == 250:
        print("Connection successful")

    conn_tls = conn.starttls()
    if conn_tls[0] == 220:
        print("TLS is Ready to start")

    """
    conn_login = conn.login(user_var, pass_var)
    if conn_login[0] == 235:
        print("Login Succesfull")
    else:
        print("Login Failed")
    """

    message1 = MIMEMultipart()
    message1['From'] = user_var
    message1['To'] = user_var
    message1['Subject'] = subject
    message1.attach(MIMEText(message, 'html'))
    payload = MIMEBase('application', 'octate-stream')

    text = message1.as_string()
    sendmail_res = conn.sendmail(user_var, user_var, text)

    if len(sendmail_res) == 0:
        print("Sent mail Successfully")

    conn_close = conn.quit()
    if conn_close[0] == 221:
        print("Connection closed successfully")

try :
    send_email_using_smtplib_cg()
except Exception as e:
    print(e)
