'use strict';

module.exports = function(sequelize, DataTypes) {
	var Message = sequelize.define('Message', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		author: DataTypes.STRING,
		content: DataTypes.STRING,
		isRead: DataTypes.BOOLEAN
	});
	
	return Message;
};