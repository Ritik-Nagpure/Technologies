import pyzmail

# access function from top of pyzmail
ret = pyzmail.compose_mail('me@foo.com', ['him@bar.com'], u'subject', 'iso-8859-1', ('Hello world', 'us-ascii'))
payload = ret[0]
#print(ret)
#print(payload)
msg = pyzmail.PyzMessage.factory(payload)
#print(msg)

# use more specific function from inside modules
print(pyzmail.generate.format_addresses([('John', 'john@foo.com')], 'From', 'us-ascii'))
#print(pyzmail.parse.decode_mail_header('=?iso-8859-1?q?Hello?='))
