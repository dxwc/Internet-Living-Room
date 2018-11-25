let router = require('express').Router();
let op     = require('../../model/api_operations');
let c      = require('./_common.js');

router.post
('/api/0.0.0/user', require('../../middleware/captcha_control.js'), (req, res) =>
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
            return res.status(201).json({ success : true });
        })
        .catch((err) =>
        {
            if(err.code === 'USER_EXISTS')
            {
                let out = {
                    success : false,
                    reason_code : -1,
                    reason_text : 'Username is not available'
                };

                let svg = c.set_captcha_get_svg(req);
                if(svg !== -1) out.captcha = svg;

                return res.status(200).json(out);
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

router.get('/api/0.0.0/user/:name', (req, res) =>
{
    if(typeof(req.params.name) === 'string')
    {
        op.get_user_info(req.params.name)
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
                console.error('/api/0.0.0/user/:name Error');
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
            reason_text : 'Invalid request, expected user name'
        });
    }
});

module.exports = router;