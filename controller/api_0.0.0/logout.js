let router = require('express').Router();

router.post('/api/0.0.0/logout', (req, res) =>
{
    if(req.user)
    {
        req.logOut();
        return res.json
        ({
            was_logged_in : true,
            success       : true
        });
    }
    else
    {
        req.logOut();
        return res.json
        ({
            was_logged_in : false,
            success       : true
        });
    }
});

module.exports = router;