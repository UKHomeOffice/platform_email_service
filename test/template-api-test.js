'use strict';

var nock = require('nock');
var request = require('request');

var templateResponse = {
  list: {
    statusCode: 200,
    response: {
      0: 'template.html',
      1: 'template2.html'
    }
  },
  get: {
    statusCode: 200,
    template: 'test.stub',
    response: {
      body: '<html>Hello {{world}}</html>',
    }
  },
  post: {
    statusCode: 201,
    name: 'test.stub',
    body: '<html>Hello {{world}}</html>',
    response: {
      filename: 'templates/test.stub',
      length: 28
    }
  },
  put: {
    statusCode: 200,
    template: 'test.stub',
    body: '<html>Hello {{world}}</html>',
    response: {
      filename: 'templates/test.stub',
      length: 28
    }
  },
  delete: {
    statusCode: 204,
    template: 'test.stub',
    response: {
    }
  }
};

nock('http://testmailservice.com')
  .get('/template/list')
  .reply(200, JSON.stringify(templateResponse.list.response))
  .get('/template/get/' + templateResponse.get.template)
  .reply(200, JSON.stringify(templateResponse.get.response))
  .post('/template/add')
  .reply(201, JSON.stringify(templateResponse.post.response))
  .put('/template/update/' + templateResponse.put.template)
  .reply(200, JSON.stringify(templateResponse.put.response))
  .delete('/template/delete/' + templateResponse.delete.template)
  .reply(204, templateResponse.delete.response);

describe('Template api', function testTemplateApi() {

  it('can retrieve a list of templates', function testTemplateList(done) {
    request.get('http://testmailservice.com/template/list', function testResponse(err, res, body) {
      expect(err).to.equal(null, ' and the error is null');
      expect(res.toJSON().statusCode).to.equal(templateResponse.list.statusCode, ' and the status is 200');
      expect(JSON.parse(body).length).to.equal(templateResponse.list.response.length, ' that has 2 elements');
      expect(JSON.parse(body)).to.deep.equal(templateResponse.list.response, ' that equals our predefined list');
      done();
    });
  });

  it('can retrieve a single template', function testTemplateFetch(done) {
    request.get(
      'http://testmailservice.com/template/get/' + templateResponse.get.template,
      function testResponse(err, res, body) {
      expect(err).to.equal(null, ' and the error is null');
      expect(res.toJSON().statusCode).to.equal(templateResponse.get.statusCode, ' and the status is 200');
      expect(JSON.parse(body)).to.deep.equal(templateResponse.get.response, ' the html matches');
      done();
    });
  });

  it('can add a new template', function testTemplateCreate(done) {
    var form = {
      form: {
        body: templateResponse.post.body,
        name: templateResponse.post.name
      }
    };

    request.post('http://testmailservice.com/template/add', form, function testResponse(err, res, body) {
      expect(err).to.equal(null, ' and the error is null');
      expect(res.toJSON().statusCode).to.equal(templateResponse.post.statusCode, ' and the status is 201');
      expect(JSON.parse(body).length).to.equal(templateResponse.post.body.length, ' the content length is 28');
      expect(JSON.parse(body)).to.deep.equal(templateResponse.post.response, ' that equals our response');
      done();
    });
  });

  it('can update an existing template', function testTemplateUpdate(done) {
    request.put(
      'http://testmailservice.com/template/update/' + templateResponse.put.template,
      function testResponse(err, res, body) {
      expect(err).to.equal(null, ' and the error is null');
      expect(res.toJSON().statusCode).to.equal(templateResponse.put.statusCode, ' and the status is 200');
      expect(JSON.parse(body).length).to.equal(templateResponse.put.body.length, ' the content length is 28');
      expect(JSON.parse(body)).to.deep.equal(templateResponse.put.response, ' that equals our response');
      done();
    });
  });

  it('can delete an existing template', function testTemplateDelete(done) {
    request.del(
      'http://testmailservice.com/template/delete/' + templateResponse.put.template,
      function testResponse(err, res, body) {
      expect(err).to.equal(null, ' and the error is null');
      expect(res.toJSON().statusCode).to.equal(templateResponse.delete.statusCode, ' and the status is 204');
      expect(body).to.equal(JSON.stringify(templateResponse.delete.response), ' the content is an empty object');
      done();
    });
  });
});
