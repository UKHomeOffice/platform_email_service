'use strict';

var fs = require('fs');
var templateEngine = require('hogan-express-strict');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var SmtpService = function SmtpService(emailModel) {
  this.dataModel = emailModel || {};
  this.template = null;
  this.compiledTemplate = null;

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
  if (undefined !== this.dataModel.template) {
    fs.readFile(this.dataModel.template, function loadTemplateFile(error, data) {
      if (error) {
        throw error;
      }

      this.template = data;
    });
  }
};

/**
 * Work out magic and return the processed template
 * @returns {*|String}
 */
SmtpService.prototype.prepareContent = function prepareContent() {
  if (this.template === null) {
    this.loadTemplate();
  }

  this.compiledTemplate = templateEngine.compile(this.template);
  return this.compiledTemplate.render(this.dataModel.data);
};

SmtpService.prototype.set = function set(key, value) {
  if (this.hasOwnProperty(key) === true) {
    this[key] = value;
  }
};

SmtpService.prototype.get = function get(key) {
  if (this.hasOwnProperty(key) === true) {
    return this[key];
  }
};

SmtpService.prototype.send = function send() {
  if (this.compiledTemplate === null) {
    this.loadTemplate();
    this.prepareContent();
  }

  var mailOptions = {
    from: this.dataModel.sender,
    to: this.dataModel.recipient,
    subject: this.dataModel.subject,
    html: this.compiledTemplate,
    text: JSON.stringify(this.dataModel.data)
  };

  this.emailTransport.sendMail(mailOptions, function processResponse(error, response) {
    if (error) {
      throw error;
    } else {
      return {success: true, message: response.message};
    }
  });
};

module.exports = SmtpService;
