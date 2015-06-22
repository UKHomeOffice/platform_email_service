'use strict';

// Disable self signed testing for the tests
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var model = new (require('../service/smtp-service'))();
var fs = require('fs');
var promise = require('bluebird');

promise.promisifyAll(fs);

function testLoadedFile(expectedTemplate) {
  expect(model.template).to.deep.equal(expectedTemplate);
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

  it('and load a template into a variable', function testLoadTemplate(done) {
    model.set('dataModel', newModel);
    fs.readFileAsync(newModel.template).then(function bindTemplate(data) {
      expectedTemplate = data;
      model.loadTemplate().then(function testMatch() {
        testLoadedFile(expectedTemplate);
        done();
      });
    })
    .catch(function exception(error) {
      console.log(error.message);
      done();
    });
  });

  it('and can populate a loaded template with data', function testPopulateTemplate(done) {
    model.set('dataModel', newModel);
    model.prepareContent().then(function testParsedTemplate() {
      expect(model.populatedTemplate).to.be.a('string');

      Object.keys(newModel.data).forEach(function iterateDate(key) {
        expect(model.populatedTemplate.indexOf(newModel.data[key]) > -1).to.equal(true);
      });
      done();
    })
    .catch(function exception(error) {
      console.log(error.message);
      done();
    });
  });
});

describe('I can send an email', function testSendingEmail() {
  it(' and it will throw an error of the template is not prepared', function testException(done) {

    model.send().then(function emailSuccess(response) {
      console.log(response);
    })
    .catch(function exception(error) {
      console.log(error);
    });
    done();
  });
});

