const Sequelize = require('sequelize');

const sequelize = new Sequelize
    (
    'ilr',
    'ilr_admin',
    'ilr_pass',
    {
        host: 'localhost',
        dialect: 'postgres',
        logging: false,
        operatorsAliases: false // removes a deprecation warning
    }
    );

const user = sequelize.define
    (
    'user',
    {
        id:
        {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        uname:
        {
            type: Sequelize.TEXT,
            unique: true,
            allowNull: false
        },
        upass:
        {
            type: Sequelize.TEXT,
            allowNull: false
        },
        fname:
        {
            type: Sequelize.TEXT,
            allowNull: true
        },
        lname:
        {
            type: Sequelize.TEXT,
            allowNull: true
        }
    }
    );

const channel = sequelize.define
    (
    'channel',
    {
        id:
        {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        host:
        {
            type: Sequelize.UUID,
            references:
            {
                model: user,
                key: 'id'
            }
        },
        capacity:
        {
            type: Sequelize.INTEGER,
            defaultValue: 1
        }
    }
    );

const video = sequelize.define
(
    'video',
    {
        id : // video id extracted from url
        {
            type : Sequelize.TEXT,
            primaryKey : true,
            validate :
            {
                is  : /^[a-zA-Z0-9_-]+$/, // https://youtu.be/gocwRvLhDf8
                len : 11
            }
        },
        channel : // sent for which created channel
        {
            type : Sequelize.UUID,
            primaryKey : true,
            references :
            {
                model : channel,
                key : 'id'
            }
        },
        length : // duration in seconds
        {
            type : Sequelize.INTEGER,
            allowNull : false,
            validate :
            {
                min : 0
            }
        },
        by : // submitted by user
        {
            type : Sequelize.UUID,
            references :
            {
                model : user,
                key : 'id'
            }
        },
        vote : // vote count
        {
            type : Sequelize.INTEGER,
            defaultValue : 0,
            allowNull : false
        }
    }
);

<<<<<<< HEAD
const votes = sequelize.define('votes', {
    // each person will vote for only one video in each channel
    // same person cannot reappear in the same channel again with different vote
    // same person in the same channel cannot have the same vote
    person: {
        // the person who vote
        type: Sequelize.TEXT,
        unique: 'compositeIndex', // this allow person + vote + channel become a unique index
        allowNull: false,
        references: {
            model: user,
            key: 'uname'
        }
    },
    vote: {
        // the video that the person chose
        type: Sequelize.UUID,
        allowNull: false,
        unique: 'compositeIndex',
        references: {
            model: video,
            key: 'id'
        }
    },
    channel: {
        // the channel which the person and video are in
        type: Sequelize.UUID,
        allowNull: false,
        unique: 'compositeIndex',
        references: {
            model: channel,
            key: 'id'
        }
    }
}
);

function connect() {
    return new Promise((resolve, reject) => {
=======
const main_ch_video = sequelize.define
(
    'main_ch_video',
    {
        id : // video id extracted from url
        {
            type : Sequelize.TEXT,
            primaryKey : true,
            validate :
            {
                is  : /^[a-zA-Z0-9_-]+$/, // https://youtu.be/gocwRvLhDf8
                len : 11
            }
        },
        length : // duration in seconds
        {
            type : Sequelize.INTEGER,
            allowNull : false,
            validate :
            {
                min : 0
            }
        },
        by : // submitted by user
        {
            type : Sequelize.UUID,
            references :
            {
                model : user,
                key : 'id'
            }
        },
        vote : // vote count
        {
            type : Sequelize.INTEGER,
            defaultValue : 0,
            allowNull : false
        }
    }
);

function connect()
{
    return new Promise((resolve, reject) =>
    {
>>>>>>> 8dc1dba66e1d5b631bf7b33d95296e7a57b9912d
        sequelize.sync
            ({
                logging: false,
                // force: true, // deletes all data
                // alter : true // deleted data where necessary
            })
            .then(() => {
                console.info('- DB server connection started');
                return resolve(sequelize);
            })
            .catch((err) => {
                console.error('Error setting up tables');
                console.error(err);
                process.exit(1);
            });
    });
}


module.exports.sequelize     = sequelize;
module.exports.connect       = connect;
module.exports.user          = user;
module.exports.channel       = channel;
module.exports.video         = video;
module.exports.main_ch_video = main_ch_video;