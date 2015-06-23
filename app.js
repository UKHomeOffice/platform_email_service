'use strict';

var express = require('express');
var app = express();
var debug = require('debug')('*');

var emailApi = require('./controller/email');
var templateApi = require('./controller/template');

app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('body-parser').json());

// Email api endpoints
app.post('/email/send', emailApi.sendEmail);

// Template api endpoints
app.post('/template/add', templateApi.addTemplate);
app.get('/template/get/:templateName', templateApi.getTemplate);
app.get('/template/list', templateApi.listTemplates);
app.put('/template/update/:templateName', templateApi.updateTemplate);
app.delete('/template/delete/:templateName', templateApi.deleteTemplate);

app.listen(require('./config').PORT);

debug('Email service listening on port %o', require('./config').PORT);
