let model = require('./setup.js');
const val = require('validator');

function sign_up
(
    user_name,
    password
)
{
    return model.user.create
    ({
        uname : val.escape(user_name),
        upass : val.escape(password)
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

module.exports.sign_up = sign_up;