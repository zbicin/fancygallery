'use strict';
var qfs = require('q-io/fs');

module.exports = {
	generate: function(sourceFilePath, thumbnailFilePath) {
		return qfs.copy(sourceFilePath, thumbnailFilePath);
	}
};