'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = 'development';
const config = require('../config/config.json')['development'];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

//fs stand for file system
//readdirSync gets all the file in model directory
//filter out index.js, remaining channel.js and user.js
//for each: iterate over each file, imports the file into the db

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    //this makes the first letter of model name capital
    const modelName = `${model.name.charAt(0).toUpperCase()}${model.name.slice(1)}`;
   //create db
   db[modelName] = model;
  });
//invokes association key: foreign key if there is one
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});




db.sequelize = sequelize;
db.Sequelize = Sequelize;
/*
this updates tables, but produces errors
if you want to update data model, you can run this,
then comment this, and run again
db.sequelize.sync({force: true});
*/

module.exports = db;


/**
const sequelize = new Sequelize
(
    'ilr',
    'ilr_admin',
    'ilr_pass',
    {
        host : 'localhost',
        dialect : 'postgres',
        logging : false,
        operatorsAliases : false // removes a deprecation warning
    }
);

const user = sequelize.define
(
    'user',
    {
        id :
        {
            type : Sequelize.UUID,
            defaultValue : Sequelize.UUIDV4,
            primaryKey: true
        },
        uname :
        {
            type : Sequelize.TEXT,
            unique : true,
            allowNull : false
        },
        upass :
        {
            type : Sequelize.TEXT,
            allowNull : false
        },
        fname :
        {
            type : Sequelize.TEXT,
            allowNull : true
        },
        lname :
        {
            type : Sequelize.TEXT,
            allowNull : true
        }
    }
);

const channel = sequelize.define
(
    'channel',
    {
        id :
        {
            type : Sequelize.UUID,
            defaultValue : Sequelize.UUIDV4,
            primaryKey: true
        },
        host :
        {
            type : Sequelize.UUID,
            references :
            {
                model : user,
                key : 'id'
            }
        },
        capacity :
        {
            type : Sequelize.INTEGER,
            defaultValue : 1
        }
    }
);

function connect()
{
    return new Promise((resolve, reject) =>
    {
        sequelize.sync
        ({
            logging : false,
            // force: true, // deletes all data
            // alter : true // deleted data where necessary
        })
        .then(() =>
        {
            console.info('- DB server connection started');
            return resolve(sequelize);
        })
        .catch((err) =>
        {
            console.error('Error setting up tables');
            console.error(err);
            process.exit(1);
        });
    });
}


module.exports.sequelize = sequelize;
module.exports.connect = connect;
module.exports.user = user;
module.exports.channel = channel;
**/