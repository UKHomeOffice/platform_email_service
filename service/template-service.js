'use strict';

var fs = require('fs');
var promise = require('bluebird');

promise.promisifyAll(fs);

var TemplateService = function TemplateService() {
  this.templateBuffer = null;
};

TemplateService.prototype.templateExists = function templateExists(templateName) {
  return fs.statAsync(templateName).then(function fileExists() {
    return true;
  })
  .catch(function error(err) {
    err.friendlyError = 'The template ' + templateName + ' does not exist on the file system';
    throw err;
  });
};

TemplateService.prototype.addTemplate = function addTemplate(templateName, bodyContent) {
  return fs.openAsync(templateName, 'wx').then(function createTemplate(filePointer) {
    return fs.writeAsync(filePointer, bodyContent)
    .catch(function writeError(err) {
        throw err;
      });
  })
  .catch(function updateRequire() {
    var errorBody = new Error();
    errorBody.message = 'The template ' + templateName + ' currently exists on the filesystem';
    errorBody.code = 500;

    throw errorBody;
  });
};

TemplateService.prototype.updateTemplate = function updateTemplate(templateName, bodyContent) {
  return fs.openAsync(templateName, 'r+').then(function createTemplate(filePointer) {
    return fs.writeAsync(filePointer, bodyContent)
      .catch(function writeError(err) {
        throw err;
      });
  })
    .catch(function updateRequire() {
      var errorBody = new Error();
      errorBody.message = 'The template ' + templateName + ' does not exist on the filesystem';
      errorBody.code = 404;

      throw errorBody;
    });
};

TemplateService.prototype.loadTemplate = function loadTemplate(templateName) {
  return this.templateExists(templateName).then(function fetchTemplate() {
    return fs.readFileAsync(templateName).then(function loadTemplateToBuffer(data) {
      this.templateBuffer = data;
    }.bind(this))
    .catch(function error(err) {
      throw err;
    });
  }.bind(this))
  .catch(function error(err) {
    throw err;
  });
};

TemplateService.prototype.deleteTemplate = function deleteTemplate(templateName) {
  return fs.unlinkAsync(templateName).catch(function unlinkError(err) {
    throw err;
  });
};

TemplateService.prototype.listTemplates = function listTemplates(basePath) {
  this.templatePath = basePath || './template';
  return fs.readdirAsync(this.templatePath).then(function success(data) {
    return data;
  })
  .catch(function error(err) {
    throw err;
  });
};

TemplateService.prototype.getTemplate = function getTemplate() {
  return this.templateBuffer;
};

TemplateService.prototype.getTemplateAsString = function getTemplateAsString() {
  return this.templateBuffer.toString();
};

module.exports = TemplateService;
