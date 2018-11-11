const passport = require('passport');
const Lcl      = require('passport-local').Strategy;
const model    = require('../model/setup.js');

passport.use
(
    new Lcl((uname_given, pass_given, done) =>
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
                return model.user.verify_user(pass_given)
                .then((result) =>
                {
                    if(!result) return done(null, false);
                    else        return done(null, res.dataValues);
                })
                .catch((err) => done(err));
        })
        .catch((err) => done(err));
    })
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) =>
{
    model.user.findOne({ id : id })
    .then((user) => (user && user) ? done(null, res) : done(null, false))
    .catch((err) => done(err));
});

module.exports = passport;