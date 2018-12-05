const model  = require('./setup.js');
const val    = require('validator');
const bcrypt = require('bcrypt');

function sign_up
(
    user_name,
    password
)
{
    return bcrypt.hash(password, 8)
    .then((hashed_password) =>
    {
        return model.user.create
        ({
            uname : val.escape(user_name),
            upass : hashed_password
        });
    })
    .then((res) => res.dataValues.id)
    .catch((err) =>
    {
        if(err.parent && err.parent.code === '23505')
        {
            err = new Error('User with that username already exists');
            err.code = 'USER_EXISTS';
            throw err;
        }
        else
        {
            throw err;
        }
    });
}

function get_user_info(name)
{
    return model.user.findOne
    ({
        where : { uname : val.escape(name) },
        attributes : ['uname', 'fname', 'lname', 'createdAt']
    })
    .then((res) =>
    {
        if(!res || !res.dataValues)
        {
            let err = new Error('No such user exists on DB');
            err.code ='NO_USER';
            throw err;
        }
        else
        {
            return ({
                user_name      : val.unescape(res.dataValues.uname),
                first_name     : res.dataValues.fname ?
                                    val.unescape(res.dataValues.fname) : null,
                last_name      : res.dataValues.lname ?
                                    val.unescape(res.dataValues.lname) : null,
                registered_on  : res.dataValues.createdAt
            });
        }
    })
    .catch((err) =>
    {
        throw err;
    });
}

function create_channel(user_id)
{
    return model.channel.destroy({ where : { host : user_id }})
    .then(() => model.channel.create({ host : user_id }))
    .then((res) => res.dataValues.id)
    .catch((err) => { throw err });
}

function get_next_video(channel_id)
// TODO: fix function after correct model is added
{
    return Promise.resolve([channel_id, null]);
    /*
    return model.?????.findOne
    ({
        where : { channel : channel_id },
        order : [ ['vote', 'DESC'] ]
    })
    .then((res) =>
    {
        if(!res || !res.dataValues)
        {
            return [channel_id, null];
        }
        else
        {
            return [channel_id, res.dataValues];
        }
    })
    .catch((err) =>
    {
        throw err;
    });
    */
}

function get_next_main_ch_video()
// TODO: fix function after correct model is added
{
    return Promise.resolve(null);
    /*
    return model.????.findOne
    ({
        order : [ ['vote', 'DESC'] ]
    })
    .then((res) =>
    {
        if(!res || !res.dataValues)
        {
            return null;
        }
        else
        {
            return res.dataValues;
        }
    })
    .catch((err) =>
    {
        throw err;
    });
    */
}

module.exports.sign_up                = sign_up;
module.exports.get_user_info          = get_user_info;
module.exports.create_channel         = create_channel;
module.exports.get_next_video         = get_next_video;
module.exports.get_next_main_ch_video = get_next_main_ch_video;