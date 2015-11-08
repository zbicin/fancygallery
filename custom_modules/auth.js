var basicAuth = require('basic-auth');
var authConfig = require('../config/auth.json');

module.exports = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.send(401);
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if (user.name === authConfig.user && user.pass === authConfig.password) {
    return next();
  } else {
    return unauthorized(res);
  };
};