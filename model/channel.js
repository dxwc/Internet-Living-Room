const User = require("./user.js");
//const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	const Channel = sequelize.define('channel', {
		id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        host: {
        	type: DataTypes.UUID,
        	allowNull: false
        }
	});
/*
	Channel.associate = (model) => {
		model.Channel.hasMany(model.User);
	}
	*/
	return Channel;
}



