'use strict';

var emailService = new (require('../service/smtp-service'))();

exports.sendEmail = function sendEmail(req, res, next) {

  var dataModel = req.body.dataModel || {};
  emailService.set('dataModel', JSON.parse(dataModel));

  emailService.loadTemplate().then(function templateLoaded() {
    emailService.prepareContent().then(function contentPrepared() {
      emailService.send().then(function mailSent(result) {
        res.status(201).send(result);
      });
    });
  })
  .catch(function mailFailed(err) {
      res.status(400).send(err);
      next(err);
    });
};
