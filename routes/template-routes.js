'use strict';

var templateApi = require('../controller/template');

module.exports = function addTemplateRoutes(app) {

  app.get('/template/get/:templateName', templateApi.getTemplate);
  app.get('/template/list', templateApi.listTemplates);
  app.post('/template/add', templateApi.addTemplate);
  app.put('/template/update/:templateName', templateApi.updateTemplate);
  app.delete('/template/delete/:templateName', templateApi.deleteTemplate);
};
