let router = require('express').Router();
let c      = require('./_common.js');

router.get('/api/0.0.0/auth', (req, res) =>
{
    let svg = c.set_captcha_get_svg(req);

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

module.exports = router;