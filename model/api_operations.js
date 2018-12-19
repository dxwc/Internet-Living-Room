const model   = require('./setup.js');
const val     = require('validator');
const bcrypt  = require('bcrypt');
let sequelize = require('./setup.js').sequelize;

// TODO: change all find functions use with raw : true

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

function submit_video(video_id, which_channel, seconds, who_submit)
{
    return model.video.findOrCreate
    ({
        // where same video appear in the same channel twice
        where: { id : video_id, channel : which_channel },
        // if the video does not exist yet, we will create it
        defaults: { by : who_submit, length : seconds },
        attributes : [ 'id' ]
    })
    .spread((vid, created) =>
    {
        if(created) return { created : true, id : vid.id }
        else        return { creted : false, id : vid.id } // TODO: add +1 vote
    })
    .catch((err) =>
    {
        if(err.original && err.original.code === '23503')
        {
            let err = new Error('Channel does not exists');
            err.code = 'NO_CHANNEL';
            throw err;
        }
        else
        {
            throw err;
        }
    });
}

function main_ch_submit_video(video_id, seconds, who_submit)
{
    return model.main_ch_video.findOrCreate
    ({
        // where same video appear in the same channel twice
        where: { id : video_id },
        // if the video does not exist yet, we will create it
        defaults: { by : who_submit, length : seconds },
        attributes : [ 'id' ]
    })
    .spread((vid, created) =>
    {
        if(created) return { created : true, id : vid.id }
        else        return { creted : false, id : vid.id } // TODO: add +1 vote
    })
    .catch((err) =>
    {
        throw err;
    });
}

function get_video_list(channel_id)
{
    // return a list of video submitted in the channel
    return model.video.findAll
    ({
        where : { channel : channel_id },
        attributes : [ 'id' ],
        raw : true
    })
    .catch((err) =>
    {
        throw err;
    });
}

function create_channel(user_id)
{
    // find if the user is a host
    return model.channel.findOne({ where : { host : user_id } })
    .then((result) =>
    {
        if(!result)
        {
            // create a channel if he is not a host
            return model.channel.create({ host : user_id })
            .then((res) => res.dataValues.id)
            .catch((err) =>
            {
                throw err
            });
        }
        else
        {
            // if he is host
            // destroy all the video in the channel, delete channel,
            // create a new channel
            return model.video.destroy({ where : { channel : result.id } })
            .then(() => model.channel.destroy({ where : { host : result.host } }))
            .then(() => model.channel.create({ host : result.host }))
            .then((res) => res.dataValues.id)
            .catch((err) =>
            {
                throw err;
            });
        }
    })
    .catch((err) =>
    {
        throw err;
    });
}

function get_next_video(channel_id)
{
    return model.video.findOne
    ({
        where : { channel : channel_id },
        order : sequelize.random()
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
}

function get_next_main_ch_video()
{
    return model.main_ch_video.findOne
    ({
        order : sequelize.random()
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
}

module.exports.sign_up                = sign_up;
module.exports.get_user_info          = get_user_info;
module.exports.create_channel         = create_channel;
module.exports.get_next_video         = get_next_video;
module.exports.get_next_main_ch_video = get_next_main_ch_video;
module.exports.submit_video           = submit_video;
module.exports.get_video_list         = get_video_list;
module.exports.main_ch_submit_video   = main_ch_submit_video;
