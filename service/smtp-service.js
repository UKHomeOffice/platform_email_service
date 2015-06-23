'use strict';

var fs = require('fs');
var templateEngine = require('handlebars');
var templateService = new (require('./template-service'))();
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

SmtpService.prototype.getTemplatePath = function getTemplatePath() {
  return this.dataModel.template;
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
  return templateService.loadTemplate(this.getTemplatePath()).then(function bindTemplate() {
    this.template = templateService.getTemplateAsString();
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
  return templateService.loadTemplate(this.getTemplatePath()).then(function bindData() {
    this.template = templateService.getTemplateAsString();
    this.compiledTemplate = templateEngine.compile(this.template);
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
  };

  return new Promise(function sendMailAysnc(resolve, reject) {
    this.emailTransport.sendMail(mailOptions, function callback(error, info) {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  }.bind(this));
};

module.exports = SmtpService;
