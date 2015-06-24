'use strict';

var emailService = new (require('../service/smtp-service'))();

exports.sendEmail = function sendEmail(req, res) {
  emailService.set('dataModel', req.body.dataModel || {});

  emailService.send().then(function mailSent(result) {
    res.status(200).send(result);
  })
  .catch(function mailFailed(err) {
    res.status(400).send(err);
  });
};
