'use strict';

var model = new (require('../service/smtp-service'))();
var fs = require('fs');

function testLoadedFile(expectedTemplate) {
  expect(model.template).to.equal(expectedTemplate);
}

var newModel = {
  sender: 'test@localhost',
  recipient: 'brett.minnie@gmail.com',
  subject: 'This is a test message',
  template: './test/template/test-email.html',
  data: {
    firstname: 'FirstName',
    familyname: 'Test Family Name',
    foo: 'bar'
  }
};

describe('Service initialisation', function serviceInitialization() {
  it('The model should be initialised with and empty dataModel', function testEmptyDataModel() {
    expect(model.dataModel).to.be.an('object');
    expect(model).to.have.property('dataModel');
    expect(model.dataModel).to.deep.equal({});
  });

  it('I can set the data model', function testICanSetADataModel() {
    expect(model.dataModel).to.deep.equal({});
    model.set('dataModel', newModel);
    expect(model.dataModel).to.deep.equal(newModel);
  });

  it('I have an intialised email transport object', function testTransportObject() {
    expect(model.emailTransport.transporter.name).to.equal('SMTP');
    expect(model.emailTransport.transporter.options.host).to.equal('localhost');
    expect(model.emailTransport.transporter.options.port).to.equal(25);
  });
});

describe('I can manipulate email templates', function emailTemplateManipulation() {
  var expectedTemplate;

  it('The service should have a null template by default', function testDefaultTemplateIsNull() {
    expect(model).to.have.property('template');
    expect(model.template).to.equal(null);
  });

  it('and load a template into a variable', function testLoadTemplate() {
    fs.readFile(newModel.template, function loadTemplateFile(error, data) {
      if (error) {
        console.log(error.message);
      }
      expectedTemplate = data;

      testLoadedFile(expectedTemplate);
    });

    model.set('dataModel', newModel);
    model.loadTemplate();
  });

  /*it ('and can populate a loaded template with data', function testPopulateTemplate() {
    model.set('dataModel', newModel);
    var result = model.prepareContent();
    console.log(result);

  });*/
});
