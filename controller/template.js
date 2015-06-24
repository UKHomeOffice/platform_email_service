'use strict';

var templateService = new (require('../service/template-service'))();
var templateConfig = require('../config/template.json');

exports.addTemplate = function addTemplate(req, res, next) {
  var templatePath = req.body.templatepath || templateConfig.installationPath;
  var body = req.body.templateBody;
  var name = req.body.templateName;

  templateService.addTemplate(templatePath + '/' + name, body).then(function templateCreated() {
    res.status(201).send(
      {
        filename: name,
        length: body.length
      }
    )
    .catch(function error(err) {
      res.status(err.code).send(err);
      next(err);
    });
  });
};

exports.getTemplate = function getTemplate(req, res, next) {
  var templatePath = req.headers.templatepath || templateConfig.installationPath;
  var templateName = req.param('templateName');

  templateService.loadTemplate(templatePath + '/' + templateName).then(function returnTemplate() {
    res.status(200).send({
      body: templateService.getTemplateAsString()
    });
  })
  .catch(function error(err) {
    res.status(err.code).send(err);
    next(err);
  });
};

exports.listTemplates = function listTemplates(req, res, next) {
  var templatePath = req.headers.templatepath || templateConfig.installationPath;

  templateService.listTemplates(templatePath).then(function returnList(data) {
    res.status(200).send(data);
  })
  .catch(function error(err) {
    res.status(err.code).send(err);
    next(err);
  });
};

exports.updateTemplate = function updateTemplate(req, res, next) {
  var templatePath = req.body.templatepath || templateConfig.installationPath;
  var body = req.body.templateBody;
  var name = req.param('templateName');

  templateService.updateTemplate(templatePath + '/' + name, body).then(function templateCreated() {
    res.status(200).send({
      filename: name,
      length: body.length
    });
  })
  .catch(function error(err) {
    res.status(err.code).send(err);
    next(err);
  });
};

exports.deleteTemplate = function deleteTemplate(req, res, next) {
  var templatePath = req.body.templatepath || templateConfig.installationPath;
  var name = req.param('templateName');

  templateService.deleteTemplate(templatePath + '/' + name).then(function templateDeleted() {
    res.status(204).send({
      filename: name
    });
  })
  .catch(function error(err) {
    res.status(500).send(err);
    next(err);
  });
};
