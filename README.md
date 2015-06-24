# platform_email_service
Email Microservice in NodeJS

[![Build Status](https://travis-ci.org/UKHomeOffice/platform_email_service.svg)](https://travis-ci.org/UKHomeOffice/platform_email_service)

Getting started

If you need a development mail server I suggest [Fake SMTP](https://nilhcem.github.io/FakeSMTP/) no setup, just follow the instructions.

Edit `config/smtp.json` to point to your smtp server (if using FakeSMTP bind this to port 8082 and set that as your port in this file)
Edit `config/template.json` to point to your template path

`$ npm install`

`$ node app.js`



## Template API End points
These will be deprecated in the future

Both of the GET methods can take an optional header paramter of templatepath to specify an non standard path

GET template/list to retrieve a list of templates returns 200 or 404
 
GET template/get/<templateName> to retrieve a specific template returns 200 or 404

POST template/add with the following body parameters creates a new template returns 201 or 400

```
  templatePath: <optional>
  body: <raw html of the template>
  name: <the templates name for on the filesystem>
```

PUT template/update/<templatename> with the following body parameters creates a new template returns 200 or 400

```
  templatePath: <optional>
  body: <raw html of the template>
  name: <the templates name for on the filesystem>
```

DELETE template/delete/<templatename> removes a template from the filesystem returns 204 or 400 with an empty body

## Email API End points

These will be deprecated in the future

POST email/send with the following payload as a JSON string to send an email will return a 201 or 400 

```
  dataModel = {
    "sender": "test@localhost", 
    "recipient": "recipient@localhost",
    "subject": "<message subject>",
    "template": "<template name>",
    "data": {
      //Template data in key value pairs                     
    }
```

