let router    = require('express').Router();
let is_logged = require('./function/is_logged');

router.get('/', (req, res) =>
{
    return res.render
    (
        'home',
        { name : is_logged(req) }
    );
});

module.exports = router;