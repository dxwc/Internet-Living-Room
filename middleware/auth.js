const passport = require('passport');
const Lcl      = require('passport-local').Strategy;
const model    = require('../model/setup.js');
const bcrypt   = require('bcrypt');

passport.use
(
    new Lcl
    (
        {
            usernameField : 'user_name',
            passwordField : 'password'
        },
        (uname_given, pass_given, done) =>
        {
            return model.user.findOne
            ({
                where : { uname : uname_given },
                attributes : ['id', 'upass']
            })
            .then((res) =>
            {
                if(!res || !res.dataValues)
                    return done(null, false);
                else
                    bcrypt.compare(pass_given, res.dataValues.upass)
                    .then((is_maching) =>
                    {
                        if(!is_maching) return done(null, false);
                        else            return done(null, res.dataValues);
                    })
                    .catch((err) => done(err));
            })
            .catch((err) => done(err));
        }
    )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) =>
{
    model.user.findOne
    ({
        where : { id : id },
        attributes : ['uname', 'fname', 'lname', 'createdAt']
    })
    .then((res) =>
    {
        if(res && res.dataValues) done(null, res.dataValues);
        else                      done(null, false);
    })
    .catch((err) => done(err));
});

module.exports = passport;