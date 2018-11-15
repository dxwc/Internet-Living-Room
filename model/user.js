const bcrypt = require('bcrypt-nodejs');
//const sequelize = require('./setup.js');
//const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('user', {
		id: {
            type : DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        uname: {
            type : DataTypes.STRING,
            unique : true,
            allowNull : false
        },
        upass: {
            type : DataTypes.STRING,
            allowNull : false
        },
        upass_hash: {
        	type: DataTypes.STRING,
        },
        fname: {
            type : DataTypes.STRING,
            allowNull : true
        },
        lname: {
            type : DataTypes.STRING,
            allowNull : true
        },
		});
	
        User.asscoiate = (model) => {
            model.Channel.belongsTo(model.User);
        }
	//hashed paswsword
	 /* User.beforeCreate((user) =>
        new sequelize.Promise((resolve) => {
      bcrypt.hash(user.password_hash, null, null, (err, hashedPassword) => {
        resolve(hashedPassword);
      });
        }).then((hashedPw) => {
      user.password_hash = hashedPw;
        })
    )
		//middle ware handle invalid username?
		/**.catch((err) => {
			if(err.parent && err.parent.code === '23505'){
           		err = new Error('User with that username already exists');
            	err.code = 'USER_EXISTS';
            	throw err;
        	} else {
            	throw err;
        	}
		})**/
		return User;
}

