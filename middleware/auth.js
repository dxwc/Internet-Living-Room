const passport = require('passport');
const Lcl      = require('passport-local').Strategy;
const model    = require('../model/setup.js');
const bcrypt   = require('bcrypt');
const val      = require('validator');
const xss      = require('xss-filters');

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
                attributes : ['id', 'upass', 'uname']
            })
            .then((res) =>
            {
                if(!res || !res.dataValues)
                    return done(null, false);
                else
                    bcrypt.compare(pass_given, res.dataValues.upass)
                    .then((is_maching) =>
                    {
                        res.dataValues.uname = res.dataValues.uname ?
                                        xss.inHTMLData
                                            (val.unescape
                                                (res.dataValues.uname)) :
                                        res.dataValues.uname;
                        if(!is_maching) return done(null, false);
                        else            return done(null, res.dataValues);
                    })
                    .catch((err) => done(err));
            })
            .catch((err) => done(err));
        }
    )
);

passport.serializeUser((user, done) =>
// runs after authentication, user object is recieved from done() from the local
// strtegy setup above
{
    done(null, { id : user.id, uname : user.uname });
    // on requests after user is logged in, the data on second parameter will be
    // saved to req.session.passport
});
passport.deserializeUser((user, done) =>
// runs every subsequest request and gets data from what was returned to done()
// from serializeUser
{
    done(null, true);
    // not passing data here but dummy 'true' as there is no need for duplicate copies
    // of data or hitting db.
    // Note: if the second parameter is not 'truthy', breaks since second parameter
    // is set to req.user and used to check if user is logged in or not
});

module.exports = passport;