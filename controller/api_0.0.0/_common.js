let svg_captcha = require('svg-captcha');

function captcha_is_valid(req)
{
    return req.body &&
        typeof(req.body.captcha_text) === 'string' &&
        req.body.captcha_text.length &&
        req.session &&
        req.session.captcha &&
        req.session.captcha.solution === req.body.captcha_text;
}

function set_captcha_get_svg(req)
{
    try
    {
        let captcha = process.env.TESTING ?
            svg_captcha.create({ size : 1, charPreset : 'a' }) :
            svg_captcha.create();
        req.session.captcha =
        {
            solution : process.env.TESTING ? 'a' : captcha.text
        }
        return captcha.data;
    }
    catch(err)
    {
        return -1;
    }
}

function captcha_control(req, res, next) // middleware for sign up and login
{
    if(captcha_is_valid(req)) return next();
    else
    {
        let svg = set_captcha_get_svg(req);

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

module.exports.captcha_is_valid    = captcha_is_valid;
module.exports.set_captcha_get_svg = set_captcha_get_svg;
module.exports.captcha_control     = captcha_control;