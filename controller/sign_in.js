let router    = require('express').Router();
let is_logged = require('./function/is_logged.js');

router.get('/sign_in', (req, res) =>
{
    return res.render
    (
        'sign_in',
        { name : is_logged(req) }
    );
});

module.exports = router;