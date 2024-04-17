import smtplib
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase

if True:
    sender_address = 'ritik.r-nagpure@capgemini.com'
    receiver_address = 'ritik.r-nagpure@capgemini.com'

    # Setup the MIME
    message = MIMEMultipart()
    message['From'] = sender_address
    message['To'] = receiver_address

    # The subject line
    message['Subject'] = 'TEST Mail'

    # The body and the attachments for the mail
    body1 = 'Hi,<br><br>The Ticket(s) is/are in Service Target Warning. ' \
            'Please Check. Below are the Details :-<br><br>'
    style = '<style>\
            #inc {font-family: Arial, Helvetica, sans-serif; border-collapse: collapse; width: 80%;}\
            #inc td, #inc th {border: 1px solid #ddd; padding: 8px;}\
            #inc tr:nth-child(even){background-color: #f2f2f2;}\
            #inc tr:hover {background-color: #ddd;}\
            #inc th {padding-top: 12px; padding-bottom: 12px; text-align: left; background-color: #03a5fc; color: white;}\
            </style>'
    body = body1 + style + '<table id="inc">' +\
           '<tr><th>Incident No</th><th>Assignment Group</th><th>Service</th><th>Status</th><th>Summary</th><th>SLA Date' \
           '</th><th>SLM Status</th><th>Priority</th></tr>'+'</table>' + '<br>Sent via Automation Server'
    message.attach(MIMEText(body, 'html'))
    payload = MIMEBase('application', 'octate-stream')


    session = smtplib.SMTP('de-mucdssmtp01.corp.capgemini.com', 25)
    session.ehlo()
    # enable security
    session.starttls()
    text = message.as_string()
    email_to = receiver_address.split(',')
    session.sendmail(sender_address, email_to, text)
    session.quit()
    print('Mail Sent')

else:
    print("No Opened or Active Ticket Found")
