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
    // also create a new entry in the table named "voting"
    // using findOrCreate https://sequelize.readthedocs.io/en/2.0/docs/models-usage/
    /*User
        .findOrCreate({ where: { username: 'sdepold' }, defaults: { job: 'Technical Lead JavaScript' } })
        .spread((user, created) => {
            console.log(user.get({
                plain: true
            }))
            console.log(created)
            /*
             findOrCreate returns an array containing the object that was found or created and a boolean that will be true if a new object was created and false if not, like so:
        
            [ {
                username: 'sdepold',
                job: 'Technical Lead JavaScript',
                id: 1,
                createdAt: Fri Mar 22 2013 21: 28: 34 GMT + 0100(CET),
                updatedAt: Fri Mar 22 2013 21: 28: 34 GMT + 0100(CET)
              },
              true ]
        
         In the example above, the "spread" on line 75 divides the array into its 2 parts and passes them as arguments to the callback function defined beginning at line 39, which treats them as "user" and "created" in this case. (So "user" will be the object from index 0 of the returned array and "created" will equal "true".)
            *//*
        }) */
     return model.video.findOrCreate({ 
        where: { id: video_id, channel: which_channel }, // where same video appear in the same channel twice
        defaults: { by: who_submit, length: seconds } // if the video does not exist yet, we will create it with person = user
    }).spread((vid, created) => {
        console.log(vid.get({
            plain: true
        }))
        console.log("test:"+created);
        return [vid, created];
    })
}
function get_video_list(channel_id) {
    // return a list of video submitted in the channel
    return model.video.findAll({
        where: {channel: channel_id},
        raw: true
    }).then((res) => 
    {
        return res;
    }).catch((err) =>
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
module.exports.sign_up        = sign_up;
module.exports.get_user_info  = get_user_info;
module.exports.create_channel = create_channel;
module.exports.get_next_video = get_next_video;
module.exports.get_next_main_ch_video = get_next_main_ch_video;
module.exports.submit_video           = submit_video;
module.exports.get_video_list         = get_video_list;
module.exports.validate_vote  = validate_vote;
module.exports.get_user_vote = get_user_vote;
