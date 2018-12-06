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
function create_user_vote(username, channel_id, video_id){
    return model.vote.create({
        username: username,
        channel_id: channel_id,
        video_id: video_id,
    }).then((vote) =>{
        return vote.id;
    }).catch((err)=>{
        throw err;
    });
}
function validate_vote(vote_id, vote)
{
        return model.vote.findOne(
        { where: {
            id: vote_id,

        }})
        .then((res) => {
            if(res.vote === 0){
               res.updateAttributes({
                    vote : vote,
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

function get_user_vote(vote_id){
    return model.vote.findOne({
        where: {
            id: vote_id
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
module.exports.sign_up        = sign_up;
module.exports.get_user_info  = get_user_info;
module.exports.create_channel = create_channel;
module.exports.get_next_video = get_next_video;
module.exports.validate_vote  = validate_vote;
module.exports.get_user_vote = get_user_vote;
module.exports.create_user_vote = create_user_vote;
