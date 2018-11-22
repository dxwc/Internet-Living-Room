let router      = require('express').Router();
let passport    = require('passport');
let c           = require('./_common.js');

router.post('/api/0.0.0/login', c.captcha_control, (req, res) =>
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
                let svg = c.set_captcha_get_svg(req);
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

                        let svg = c.set_captcha_get_svg(req);
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

                        return res.status(200).json
                        ({
                            success : true,
                            id      : user.id
                        });
                    }
                });
            }
        }
    )(req, res);
});

module.exports = router;