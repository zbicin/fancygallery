'use strict';

module.exports = function(sequelize, DataTypes) {
	var Picture = sequelize.define('Picture', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		categoryName: DataTypes.STRING,
		description: DataTypes.STRING,
		author: DataTypes.STRING,
		url: DataTypes.STRING
	});
	
	return Picture;
};