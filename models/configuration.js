'use strict';

module.exports = function(sequelize, DataTypes) {
	var Configuration = sequelize.define('Configuration', {
		key: {
			type: DataTypes.STRING,
			unique: true
		},
		value: DataTypes.STRING
	});
	
	return Configuration;
}