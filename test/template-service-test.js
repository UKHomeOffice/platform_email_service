'use strict';

// Disable self signed testing for the tests
var service = new (require('../service/template-service'))();
var fs = require('fs');

var templateModels = {
  validTemplate: './test/template/test-email.html',
  invalidTemplate: './test/template/' + global.testUid() + '/test-email.html',
  templatePath: './test/template',
  loadedTemplates: ['test-email.html'],
  createTemplate: './test/template/' + global.testUid() + '-email.html',
  templateBody: '<h1>Hello {{name}}</h1>',
  updateTemplateBody: '<h1>Hello {{name}}</h1>This is updated',
};

describe('The service should be initialised', function serviceInitialization() {
  it(' with an empty templateBuffer', function testEmptyBuffer() {
    expect(service).to.have.property('templateBuffer');
    expect(service.templateBuffer).to.equal(null);
  });
});

describe('The service can verify a template exists', function verifyTemplateExists() {
  it(' will return true if the template is on the file system', function statValidTemplate(done) {
    service.templateExists(templateModels.validTemplate).then(function isValidFile(data) {
      expect(data).to.equal(true);
      done();
    });

  });

  it(' will throw an error if the template is not on the file system', function statInalidTemplate(done) {
    service.templateExists(templateModels.invalidTemplate).catch(function error(err) {
      var expectedMessage = 'The template ' + templateModels.invalidTemplate + ' does not exist on the file system';
      expect(err.errno).to.equal(-2);
      expect(err.friendlyError).to.equal(expectedMessage);
      done();
    });
  });
});

describe('The service can load a template from disk', function loadingTemplates() {
  var expectedTemplate;

  it(' and load the content into a variable', function testLoadTemplate(done) {
    fs.readFileAsync(templateModels.validTemplate).then(function bindTemplate(data) {
      expectedTemplate = data;
      service.loadTemplate(templateModels.validTemplate).then(function testMatch() {
        expect(service.getTemplate()).to.deep.equal(expectedTemplate);
        expect(service.getTemplateAsString()).to.equal(expectedTemplate.toString());
        done();
      });
    });
  });
});

describe('The service can manipulate templates on persistent storage', function savingTemplates() {

  it(' and can list templates on disk', function loadTemplates(done) {
    service.listTemplates(templateModels.templatePath).then(function testDirectoryList(data) {
      expect(data).to.be.an('array');
      expect(data.length).to.equal(1);
      expect(data).to.deep.equal(templateModels.loadedTemplates);
      done();
    });
  });

  it(' and will throw an exception when trying to create a template that exists', function saveExistingTemplate(done) {
    var expectedMessage = 'The template ' + templateModels.validTemplate + ' currently exists on the filesystem';

    service.addTemplate(templateModels.validTemplate, templateModels.templateBody)
      .catch(function templateExists(err) {
        expect(err.code).to.equal(500);
        expect(err.message).to.equal(expectedMessage);
        done();
      });
  });

  it(' and will create the file when it does not exist', function saveNewTemplate(done) {
    service.addTemplate(templateModels.createTemplate, templateModels.templateBody)
      .then(function templateCreated() {
        service.loadTemplate(templateModels.createTemplate).then(function testTemplates() {
          expect(service.getTemplateAsString()).to.equal(templateModels.templateBody);
          done();
        });
      });
  });

  it(' and will throw an exception when I try update a non existant template', function updateTemplateFails(done) {
    var expectedMessage = 'The template ' + templateModels.invalidTemplate + ' does not exist on the filesystem';

    service.updateTemplate(templateModels.invalidTemplate, templateModels.templateBody)
      .catch(function templateUpdateFailed(error) {
        expect(error.message).to.equal(expectedMessage);
        expect(error.code).to.equal(404);
        done();
      });
  });

  it(' and will update the file when it does exist', function updateTemplate(done) {
    service.updateTemplate(templateModels.createTemplate, templateModels.updateTemplateBody)
      .then(function templateCreated() {
        service.updateTemplate(templateModels.createTemplate, templateModels.updateTemplateBody)
        .then(function testTemplates() {
          expect(service.getTemplateAsString()).to.not.equal(templateModels.updateTemplateBody);
          done();
        });
      });
  });

  it(' and can delete a template from the filesystem', function deleteCreatedTemplate(done) {
    service.deleteTemplate(templateModels.createTemplate)
    .then(function templateCreated() {
      service.loadTemplate(templateModels.createTemplate).catch(function testTemplates(err) {
        var expectedMessage = 'The template ' + templateModels.createTemplate + ' does not exist on the file system';
        expect(err.errno).to.equal(-2);
        expect(err.friendlyError).to.equal(expectedMessage);
        done();
      });
    });
  });
});
