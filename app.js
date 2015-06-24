'use strict';

var express = require('express');
var app = express();
var debug = require('debug')('app');

app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('body-parser').json());

require('./routes/email-routes')(app);
require('./routes/template-routes')(app);

app.listen(require('./config').PORT);

debug('Email service listening on port %o', require('./config').PORT);
