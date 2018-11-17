let router = require('express').Router();
let op     = require('../../model/api_operations');
let val    = require('validator');
let svg_captcha = require('svg-captcha');
let passport = require('passport');

function set_captcha_get_svg(req)
{
    try
    {
        let captcha = process.env.TESTING ?
            svg_captcha.create({ size : 1, charPreset : 'a' }) :
            svg_captcha.create();
        req.session.captcha =
        {
            solution : process.env.TESTING ? 'a' : captcha.text
        }
        return captcha.data;
    }
    catch(err)
    {
        return -1;
    }
}

function captcha_is_valid(req)
{
    return req.body &&
        typeof(req.body.captcha_text) === 'string' &&
        req.body.captcha_text.length &&
        req.session &&
        req.session.captcha &&
        req.session.captcha.solution === req.body.captcha_text;
}

router.post('/api/0.0.0/user', (req, res) =>
{
    if
    (
        typeof(req.body.user_name) === 'string' &&
        typeof(req.body.password)  === 'string'
    )
    {
        op.sign_up(req.body.user_name, req.body.password)
        .then((id) =>
        {
            return res.status(201).json({ success : true, id : id });
        })
        .catch((err) =>
        {
            if(err.code === 'USER_EXISTS')
            {
                return res.status(200).json
                ({
                    success : false,
                    reason_code : -1,
                    reason_text : 'Username is not available'
                });
            }
            else
            {
                return res.status(500).json
                ({
                    success : false,
                    rason_code : -3,
                    reason_text : 'Unhandled error, contact admin@example.com'
                });
            }
        });
    }
    else
    {
        return res.status(400).json
        ({
            success : false,
            reason_code : -2,
            reason_text : 'Invalid request, expected `user_name` and `password`'
        });
    }
});

router.get('/api/0.0.0/user/:id', (req, res) =>
{
    if(typeof(req.param.id) && val.isUUID(req.params.id, 4))
    {
        op.get_user_info(req.params.id)
        .then((result) =>
        {
            result.success = true;
            return res.status(200).json(result);
        })
        .catch((err) =>
        {
            if(err.code === 'NO_USER')
            {
                return res.status(200).json
                ({
                    success     : false,
                    reason_code : -1,
                    reason_text : 'No such user exists'
                });
            }
            else
            {
                console.error('/api/0.0.0/user/:id Error');
                console.error(err);
                return res.status(500).json
                ({
                    success     : false,
                    rason_code  : -3,
                    reason_text : 'Unhandled error, contact admin@example.com'
                });
            }
        });
    }
    else
    {
        return res.status(400).json
        ({
            success : false,
            reason_code : -2,
            reason_text : 'Invalid request, expected user id'
        });
    }
});

router.get('/api/0.0.0/auth', (req, res) =>
{
    let svg = set_captcha_get_svg(req);

    if(svg === -1) return res.status(500).json
    ({
        success : false,
        reason_code : -5,
        reason_text : 'Server error, retry or contact admin',
    });
    else return res.json
    ({
        success : true,
        captcha : svg
    });
});

router.post // TODO: write test
(
    '/api/0.0.0/login',
    (req, res, next) =>
    {
        if(captcha_is_valid(req)) return next();
        else
        {
            let svg = set_captcha_get_svg(req);

            if(svg === -1) return res.status(500).json
            ({
                success : false,
                reason_code : -5,
                reason_text : 'Server error, retry or contact admin',
            });
            else return res.status(409).json
            ({
                success : false,
                reason_code : -4,
                reason_text : 'Captcha solution was wrong, retry',
                captcha : svg
            });
        }
    },
    (req, res) =>
    {
        passport.authenticate
        (
            'local',
            (err, user, info) =>
            {
                if(err)
                {
                    console.error('/api/0.0.0/login error:');
                    console.error(err);
                    return res.status(500).json
                    ({
                        success : false,
                        reason_code : -6,
                        reason_text : 'Server error, retry or contact admin',
                    });
                }
                else if(!user) // if auth failed, user is false
                {
                    let svg = set_captcha_get_svg(req);
                    let out =
                    {
                        success : false,
                        reason_code : -7,
                        reason_text : 'Invalid username and/or password',
                    }

                    if(svg !== -1)
                    {
                        out.captcha = svg;
                        return res.status(400).json(out);
                    }
                    else
                    {
                        out.reason_code = -8,
                        out.reason_text = 'Server error, retry or contact admin';
                        return res.status(500).json(out);
                    }
                }
                else
                {
                    req.logIn(user, (err) =>
                    {
                        if(err)
                        {
                            console.error('Error logging in');
                            console.error(err);

                            let out =
                            {
                                success : false,
                                rason_code : -9,
                                reason_text : 'Server error, retry or contact admin'
                            }

                            let svg = set_captcha_get_svg(req);
                            if(svg !== -1) out.captcha = svg;

                            return res.status(500).json(out);
                        }
                        else
                        {
                            if
                            (
                                req.session &&
                                req.session.captcha &&
                                req.session.captcha.solution
                            )
                            {
                                delete req.session.captcha.solution;
                                delete req.session.captcha;
                            }

                            return res.json
                            ({
                                success : true,
                                id : req.session.passport.user
                            });
                        }
                    });
                }
            }
        )(req, res);
    }
);

module.exports = router;