'use strict';

var templateService = new (require('../service/template-service'))();
var templateConfig = require('../config/template.json');

exports.addTemplate = function addTemplate(request, result, next) {
  var templatePath = request.body.templatepath || templateConfig.installationPath;
  var body = request.body.templateBody;
  var name = request.body.templateName;

  templateService.addTemplate(templatePath + '/' + name, body).then(function templateCreated() {
    result.status(201);
    result.send(
      {
        filename: name,
        length: body.length
      }
    )
    .catch(function error(err) {
      result.status(err.code);
      result.send(err);
      next(err);
    });
  });
};

exports.getTemplate = function getTemplate(request, result, next) {
  var templatePath = request.headers.templatepath || templateConfig.installationPath;
  var templateName = request.param('templateName');

  templateService.loadTemplate(templatePath + '/' + templateName).then(function returnTemplate() {
    result.status(200);
    var template = templateService.getTemplateAsString();
    result.send({body: template});
  })
  .catch(function error(err) {
    result.status(err.code);
    result.send(err);
    next(err);
  });
};

exports.listTemplates = function listTemplates(request, result, next) {
  var templatePath = request.headers.templatepath || templateConfig.installationPath;

  templateService.listTemplates(templatePath).then(function returnList(data) {
    result.status(200);
    result.send(data);
  })
  .catch(function error(err) {
    result.status(err.code);
    result.send(err);
    next(err);
  });
};

exports.updateTemplate = function updateTemplate(request, result, next) {
  var templatePath = request.body.templatepath || templateConfig.installationPath;
  var body = request.body.templateBody;
  var name = request.param('templateName');

  templateService.updateTemplate(templatePath + '/' + name, body).then(function templateCreated() {
    result.status(200);
    result.send({
      filename: name,
      length: body.length
    });
  })
  .catch(function error(err) {
    result.status(err.code);
    result.send(err);
    next(err);
  });
};

exports.deleteTemplate = function deleteTemplate(request, result, next) {
  var templatePath = request.body.templatepath || templateConfig.installationPath;
  var name = request.param('templateName');

  templateService.deleteTemplate(templatePath + '/' + name).then(function templateDeleted() {
    result.status(204);
    result.send({
      filename: name
    });
  })
  .catch(function error(err) {
    result.status(500);
    result.send(err);
    next(err);
  });
};
