'use strict';

var fs = require('fs');
var promise = require('bluebird');

promise.promisifyAll(fs);

var TemplateService = function TemplateService() {
  this.templateBuffer = null;
};

TemplateService.prototype.templateExists = function templateExists(templateName) {
  fs.openAsync(templateName, 'r').then(function fileExists() {
    return true;
  })
  .catch(function error() {
    return false;
  });
};

/*TemplateService.prototype.addTemplate = function addTemplate(templateName, bodyContent) {

};*/

TemplateService.prototype.addTemplate = function updateTemplate(templateName, bodyContent) {

};

TemplateService.prototype.getTemplate = function getTemplate(templateName) {
  return fs.readFileAsync(templateName).then(function loadTemplate(data) {
    this.templateBuffer = data;
  }.bind(this))
  .catch(function error(err) {
    throw err;
  });
};

/*TemplateService.prototype.deleteTemplate = function deleteTemplate(templateName) {

};

TemplateService.prototype.listTemplates = function listTemplates() {

};*/

TemplateService.prototype.getTemplateAsString = function getTemplateAsString() {
  return this.templateBuffer.toString();
};

module.exports = TemplateService;
