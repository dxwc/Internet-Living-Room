const Sequelize = require('sequelize');
const bcrypt    = require('bcrypt');

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

const video = sequelize.define
(
    'video',
    {
        id :
        {
            type : Sequelize.UUID,
            defaultValue : Sequelize.UUIDV4,
            primaryKey: true
        },
        url_of_video :
        {
            type: Sequelize.TEXT
        },
        person :  // the person who submit the video
        {
            type : Sequelize.UUID,
            references :
            {
                model : user,
                key : 'id'
            }
        },
        channel :  // the video from which channel
        {
            type : Sequelize.UUID,
            references :
            {
                model: channel,key: 'id'
            }
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
module.exports.video = video;