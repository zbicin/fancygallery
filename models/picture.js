'use strict';

module.exports = function(sequelize, DataTypes) {
	var Picture = sequelize.define('Picture', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		categoryName: DataTypes.STRING,
		thumbnailUrl: DataTypes.STRING,
		url: DataTypes.STRING
	});
	
	return Picture;
}