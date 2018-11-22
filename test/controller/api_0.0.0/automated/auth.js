let assert  = require('assert');

function assert_get_captcha(res)
{
    assert
    (
        typeof(res.body.success) === 'boolean',
        'boolean `success` field exists'
    );

    if(res.body.success)
    {
        assert(res.status === 200, '`success` true, so 200');
        assert(typeof(res.body.captcha) === 'string', 'has `captcha` key');
        assert(res.body.captcha.length, '`captcha` data length is > 0');
        assert
        (
            res.body.captcha.indexOf('<svg')       === 0      &&
            res.body.captcha.lastIndexOf('</svg>') ===
            res.body.captcha.length-6,
            'Captcha is svg tagged data'
        );
    }
    else
    {
        assert(res.status === 500, 'captcha generation error, so 500');
        assert
        (
            res.body.reason_text,
            'Includes `reason_text` string for being unsuccessful'
        );

        assert
        (
            res.body.reason_code,
            'Includes `reason_code` code for being unsuccessful'
        );

        assert
        (
            res.body.reason_code === -5,
            'If svg couldn\'t be generated, send `reason_code` of -1'
        );

        throw new Error('Captcha generation should not have failed');
    }
}

module.exports.captcha_generation = (agent) =>
describe('captcha generation test', () =>
{
    it('should GET captcha successfully from /api/0.0.0/auth', (done) =>
    {
        agent
        .get('/api/0.0.0/auth')
        .expect('Content-Type', /json/)
        .then((res) => assert_get_captcha(res))
        .then(() => done())
        .catch((err) => done(err));
    });
});