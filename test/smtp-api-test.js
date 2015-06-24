'use strict';

var nock = require('nock');
var request = require('request');

var smtpScaffolding = {
  response: {
    accepted: {
      0: 'recipient@localhost'
    },
    rejected: {},
    response: '250 Ok',
    envelope: {
      from: 'test@localhost',
      to: {
        0: 'recipient@localhost'
      }
    },
    messageId: '1435140563256-64961534-bcbe75f3-52091ca1@localhost'
  },
  payload: {
    sender: 'test@localhost',
    recipient: 'recipient@localhost',
    subject: 'This is a test message',
    template: './test/template/test-email.html',
    data: {
      firstname: 'FirstName',
      familyname: 'Test Family Name',
      foo: 'bar'
    }
  }
};

nock('http://testmailservice.com')
  .post('/email/send')
  .reply(201, JSON.stringify(smtpScaffolding.response));

describe('Email api', function testEmailApi() {
  it('can send an email', function sendEmail(done) {
    var form = {
      form: smtpScaffolding.payload
    };

    request.post('http://testmailservice.com/email/send', form, function testResponse(err, res, body) {
      expect(err).to.equal(null, ' and the error is null');
      expect(res.toJSON().statusCode).to.equal(201, ' and the status is 201');
      expect(JSON.parse(body)).to.deep.equal(smtpScaffolding.response, ' that equals our response');
      done();
    });
  });
});
