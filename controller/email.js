'use strict';

exports.sendEmail = function sendEmail(request, result) {
  result.send(request.params);
};
