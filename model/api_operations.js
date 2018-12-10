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

function validate_vote(username, channel_id, video_id, vote)
{

        return model.vote.findOne(
        { where: {
            username: username,
            channel_id: channel_id,
            video_id: video_id,

        }})
        .then((res) => {
            console.log(res);
            if(res === null){
                //model.video.update
               model.video.findOne(
               {
                where: {
                    id: video_id,
                    channel: channel_id,
                }
               })
               .then((video) =>{
                    if(vote === 1){
                        video.increment('vote');
                    } else {
                        video.decrement('vote');
                    }
                    
               }).catch(err => {
                    throw err;
               });

               return model.vote.create({
                    username: username,
                    channel_id: channel_id,
                    video_id: video_id,
                    vote: vote,
                });

            } else {
                let  err = new Error('Already Voted for this video');
                err.code = 'Already_Voted';
                throw err;
            }
        })
        .catch(err => {
            throw err;
        });

}

function get_user_vote(username, channel_id, video_id){
    return model.vote.findOne({
        where: {
            username: username,
            channel_id: channel_id,
            video_id: video_id
        }
    }).then((vote) => {
        if(vote === null){
            let err = new Error("Vote doesn't exist");
            err.code = "Vote_Does_Not_Exist";
            throw err;
        } else {
            return vote.vote;
        }
    }).catch((err) => {
        throw err;
    })
}


module.exports.sign_up                = sign_up;
module.exports.get_user_info          = get_user_info;
module.exports.create_channel         = create_channel;
module.exports.get_next_video         = get_next_video;
module.exports.get_next_main_ch_video = get_next_main_ch_video;
module.exports.submit_video           = submit_video;
module.exports.get_video_list         = get_video_list;
module.exports.get_video_list         = get_video_list;
module.exports.validate_vote  = validate_vote;
module.exports.get_user_vote = get_user_vote;
