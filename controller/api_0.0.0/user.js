let router      = require('express').Router();
let op          = require('../../model/api_operations');
let val         = require('validator');

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

module.exports = router;