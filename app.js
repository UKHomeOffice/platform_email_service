'use strict';

var express = require('express');
var app = express();
var debug = require('debug')('*');

app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('body-parser').json());

app.use(function errorHandler(err, req, res) {
  debug('err %o, req %o, res %o', err, req, res);
});

app.listen(require('./config').PORT);
debug('Email service listening on port %o', require('./config').PORT);
