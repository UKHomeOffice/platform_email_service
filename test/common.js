'use strict';

global.chai = require('chai').use(require('sinon-chai'));
global.should = chai.should;
global.expect = chai.expect;
global.sinon = require('sinon');
require('sinomocha')();

global.testUid = function generateShortUid() {
  return ('0000' + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4);
};

process.setMaxListeners(0);
process.stdout.setMaxListeners(0);
