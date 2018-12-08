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

function submit_video(video_id, which_channel, seconds, who_submit) {
    // create a new entry in the table named "video"
    // using findOrCreate https://sequelize.readthedocs.io/en/2.0/docs/models-usage/
    return model.video.findOrCreate({ 
        where: { id: video_id, channel: which_channel }, // where same video appear in the same channel twice
        defaults: { by: who_submit, length: seconds } // if the video does not exist yet, we will create it with person = user
    }).spread((vid, created) => {
        console.log(vid.get({
            plain: true
        }))
        console.log(created)
        return [vid, created];
    }).catch((err) => {
        throw err;
    });
}

function get_video_list(channel_id) {
    // return a list of video submitted in the channel
    return model.video.findAll({
        where: {channel: channel_id},
        raw: true
    }).then((res) => {
        return res;
    }).catch((err) => {
        throw err;
    });
}
// this need to be tested
function create_channel(user_id)
{
    // find if the user is a host
    return model.channel.findOne({ where: {host: user_id}})
    .then((result) => {
        if(!result) {
            // create a channel if he is not a host
            return model.channel.create({ host : user_id })
            .then((res) => res.dataValues.id)
            .catch((err) => { throw err });
        }else {
            // if he is host
            // destroy all the video in the channel, delete channel, create a new channel
            return model.video.destroy({ where: { channel: result.id}})
            .then(() => {model.channel.destroy({ where: { host: result.host}})})
            .then(() => {model.channel.create({ host: result.host})})
            .then((res) => res.dataValues.id)
            .catch((err) => { throw err });
        }
    })
    .catch((err) => { throw err });
}

function get_next_video(channel_id)
{
    return model.video.findOne
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
}

function get_next_main_ch_video()
{
    return model.video.findOne
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
}

module.exports.sign_up                = sign_up;
module.exports.get_user_info          = get_user_info;
module.exports.create_channel         = create_channel;
module.exports.get_next_video         = get_next_video;
module.exports.get_next_main_ch_video = get_next_main_ch_video;
module.exports.submit_video           = submit_video;
module.exports.get_video_list         = get_video_list;
