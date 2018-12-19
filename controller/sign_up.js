let router    = require('express').Router();
let is_logged = require('./function/is_logged.js');

router.get('/sign_up', (req, res) =>
{
    return res.render
    (
        'sign_up',
        { name : is_logged(req) }
    );
});

module.exports = router;