'use strict';
var models = require('../models/index');

module.exports = function (req, res, next) {
  models.Configuration.findAll().then(function(entries) {
	 res.locals.configuration = {};
	 for(var i = 0; i<entries.length; i++) {
		 var singleEntry = entries[i];
		 res.locals.configuration[singleEntry.key] = singleEntry.value;
	 }
  }).catch(console.error).done(function() {
	 next();	  
  });
};