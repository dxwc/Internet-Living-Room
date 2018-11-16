const bcrypt = require('bcrypt');
//cost facotr, higher the cost factors, more hashing rounds are done
const saltRounds = 10;
//const sequelize = require('./setup.js');
//const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('user', {
		id: {
            type : DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        fname: {
            type : DataTypes.STRING,
            allowNull : true
        },
        lname: {
            type : DataTypes.STRING,
            allowNull : true
        },
        uname: {
            type : DataTypes.STRING,
            unique : true,
            allowNull : false,
            validate: {
                notEmpty: true, 
            }
        },
        upass_hash: {
            type: DataTypes.STRING,
            //allowNull: false,
        },
        upass: {
            type : DataTypes.VIRTUAL,
            validate: {
                notEmpty: true,
            },
            //allowNull : false
        },
        
		});
	   //create channel linked to user
        User.asscoiate = (model) => {
            model.Channel.belongsTo(model.User);
        }

	   //hashed paswsword
	    User.beforeCreate((user) =>
            new sequelize.Promise((resolve) => {
                bcrypt.hash(user.upass, saltRounds, (err, hashedPassword) => {
                    resolve(hashedPassword);
                });
        }).then((hashedPw) => {
            user.upass_hash = hashedPw;
        })
      );


        /*bcrypt.hash(user.upass, saltRounds)
        .then((hashedPassword) => {
            //console.log(hashedPassword);
            user.upass_hash = hashedPassword;
            console.log(user.upass)
            console.log(user.upass_hash);
        });
    }*/
       /*
       new sequelize.Promise(() => {
        
        
        bcrypt.hash(user.upass, saltRounds, (err, hashedPassword) => {
            resolve(hashedPassword);
      });
        }).then((hashedPw) => {
            user.upass_hash = hashedPassword;
        })*/
   
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
};

