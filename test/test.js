'use strict';

var assert = require('assert');

describe('Array', function testArray() {
  describe('#indexOf()', function testIndexOf() {
    it('should return -1 when the value is not present', function returnsNegativeOne() {
      assert.equal(-1, [1, 2, 3].indexOf(5));
      assert.equal(-1, [1, 2, 3].indexOf(0));
    });
  });
});

