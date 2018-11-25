let c = require('../controller/api_0.0.0/_common.js');

module.exports = (req, res, next) => // middleware for sign up and login
{
    if(c.captcha_is_valid(req)) return next();
    else
    {
        let svg = c.set_captcha_get_svg(req);

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
}