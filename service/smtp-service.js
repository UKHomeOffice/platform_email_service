'use strict';

var fs = require('fs');
var templateEngine = require('handlebars');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var promise = require('bluebird');

promise.promisifyAll(fs);

var SmtpService = function SmtpService(emailModel) {
  this.dataModel = emailModel || {};
  this.template = null;
  this.compiledTemplate = null;
  this.populatedTemplate = '';

  this.createTransport();
};

/**
 * Create our transport mechanism from config and return it
 */
SmtpService.prototype.createTransport = function createTransport() {
  var config = require('../config/smtp.json');

  this.emailTransport = nodemailer.createTransport(
    smtpTransport(
      {
        host: config.host,
        port: config.port,
        auth: {
          user: config.auth.user,
          pass: config.auth.password
        }
      }
    )
  );
};

/**
 * Load an email template specified in the body of the model
 */
SmtpService.prototype.loadTemplate = function loadTemplate() {
  return fs.readFileAsync(this.dataModel.template).then(function bindTemplate(data) {
    this.template = data;
    return this.template;
  }.bind(this))
  .catch(function exceptionHandler(error) {
    throw error;
  });
};

/**
 * Work out magic and return the processed template
 * @returns {*|String}
 */
SmtpService.prototype.prepareContent = function prepareContent() {

  return fs.readFileAsync(this.dataModel.template).then(function bindData(data) {
    this.template = data;
    this.compiledTemplate = templateEngine.compile(this.template.toString());
    this.populatedTemplate = this.compiledTemplate(this.dataModel);
    return this.populatedTemplate;
  }.bind(this))
  .catch(function exceptionHandler(error) {
    throw error;
  });
};

/**
 * Sets a property if it's defined
 * @param key
 * @param value
 */
SmtpService.prototype.set = function set(key, value) {
  if (this.hasOwnProperty(key) === true) {
    this[key] = value;
  }
};

/**
 * Retrieves our defined property
 * @param key
 * @returns {*}
 */
SmtpService.prototype.get = function get(key) {
  if (this.hasOwnProperty(key) === true) {
    return this[key];
  }
};

/**
 * Where the magic happens
 */
SmtpService.prototype.send = function send() {
  if (this.populatedTemplate === null) {
    throw new Error('Email template is not prepared');
  }

  var mailOptions = {
    from: this.dataModel.sender,
    to: this.dataModel.recipient,
    subject: this.dataModel.subject,
    html: this.compiledTemplate,
    generateTextFromHTML: true,
    secure: false,
    ignoreTLS: true,
    tls: {
      rejectUnauthorized: false
    }
  };

  return new Promise(function sendMailAysnc(res, rej) {
    this.emailTransport.sendMail(mailOptions, function callback(error, info) {
      if (error) {
        rej(error);
      } else {
        res(info.response);
      }
    });
  }.bind(this));
};

module.exports = SmtpService;
