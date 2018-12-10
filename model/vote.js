module.exports = (sequelize, DataTypes) => {
	const Vote = sequelize.define('vote', {
		username: {
			type: DataTypes.STRING,
		},
		channelid:{
			type: DataTypes.INTEGER,
		},
		videoid:{
			type: DataTypes.STRING,
		},
		vote:{
			type: DataTypes.INTEGER,
			defaultValue: 0,
		}

	});

	return Vote;
};
