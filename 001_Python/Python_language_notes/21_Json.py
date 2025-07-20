# JSON is a syntax for storing and exchanging data.
# JSON is text, written with JavaScript object notation.

import json
import requests

a = "{ '@type': 'MessageCard','@context': 'http://schema.org/extensions','themeColor': '0076D7','summary': 'There is an High/Critical ticket','sections': [{'activityTitle': 'There is an High/Critical ticket','activitySubtitle': 'Summary : <variable>','facts': [{'name': 'Incident Number : ','value': '<value>'},{'name': 'Service group : ','value': '<value>'},{'name': 'Assignment group : ','value': '<value>'},{'name': 'Primary Person : ','value': 'Name contact no.'},{'name': 'Secondary Person : ','value': 'Name contact no.'},{'name': 'First Escalation : ','value': 'Name contact no.'},{'name': 'Second Escalation : ','value': 'Name contact no.'},{'name': 'Third Escalation : ','value': 'Name contact no.'}],'markdown': true}]}"
url1 = "https://capgemini.webhook.office.com/webhookb2/0c91a981-b5ec-43a7-b511-19570c4942d6@76a2ae5a-9f00-4f6b-95ed-5d33d77c4d61/IncomingWebhook/30ae9cf49bca4dec90ad51b0e4e821a0/cc8a38cd-38bb-452a-8552-c8f8a8c87857"

def jsf():
    var = '{ "name":"John", "age":30, "city":"New York"}'
    return var

jsonobj = jsf()

y = json.loads(jsonobj)
print(y["name"])
print(y["age"])
print(y["age"])

x = {
  "name": "John",
  "age": 30,
  "city": "New York"
}

# convert into JSON:
y = json.dumps(x)

# the result is a JSON string:
print(type(x), x)
print(type(y), y)

# requests.post(url1, a)
