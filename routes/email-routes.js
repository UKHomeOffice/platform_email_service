'use strict';

var emailApi = require('../controller/email');

module.exports = function addEmailRoutes(app) {

  app.post('/email/send', emailApi.sendEmail);

};
