const User = require("./user.js");
//const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	const Channel = sequelize.define('channel', {
        host: {
        	type: DataTypes.STRING,
        	allowNull: false
        },
        description: {
        	type: DataTypes.STRING,
        }
	});
/*
	Channel.associate = (model) => {
		model.Channel.hasMany(model.User);
	}
	*/
	return Channel;
}



