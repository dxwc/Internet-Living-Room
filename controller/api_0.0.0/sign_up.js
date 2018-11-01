let router = require('express').Router();
let op     = require('../../model/api_operations');

router.post('/api/0.0.0/sign_up', (req, res) =>
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

module.exports = router;