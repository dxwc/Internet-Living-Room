const faker  = require('faker');
const assert = require('assert');

let user_test = require('./user.js');

let created_user_name = user_test.created_user_name;
let created_password  = user_test.created_password;

// TODO: logout after each login attempt (?)

function assert_login(res)
{
    assert
    (
        typeof(res.body.success) === 'boolean',
        'boolean `success` field exists'
    );

    if(res.body.success)
    {
        assert(res.status === 200, 'status should be 200 when `success` is true')
    }
    else
    {
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
            res.status === 400 ||
            res.status === 409 ||
            res.status === 500,
            'Status code should be 400, 409 or 500 when `success` is false'
        );

        if(res.status === 400)
        {
            assert(res.body.reason_code === -7, '-7 invalid username/pass');
            assert(typeof(res.body.captcha) === 'string', 'send new captcha');
        }
        else if(res.body.status === 409)
        {
            assert(res.body.reason_code === -4, '-4 for wrong captcha solution');
            assert(typeof(res.body.captcha) === 'string', 'send new captcha');
        }
        else if(res.status === 500)
        {
            assert
            (
                res.body.reason_code === -5 ||
                res.body.reason_code === -6 ||
                res.body.reason_code === -8 ||
                res.body.reason_code === -9,
                'For status code 500, reason code has to be one of these'
            );
        }
    }
}

module.exports.assert_login = assert_login;

module.exports.run = (agent) =>
describe('login test', () =>
{
    function login_test_wrapper(done, user_name, password, captcha, expect)
    {
        agent
        .post('/api/0.0.0/login')
        .set('Accept', 'application/json')
        .send
        ({
            user_name    : user_name,
            password     : password,
            captcha_text : captcha
        })
        .expect('Content-Type', /json/)
        .expect(expect)
        .then((res) => assert_login(res))
        .then(() => done())
        .catch((err) => done(err));
    }

    it
    (
        // 0, 0, 0
        'should POST for login with unknown username, unknown pass with ' +
        'incorrect captcha',
        (done) =>
        {
            login_test_wrapper
            (done, faker.internet.userName, faker.internet.password, '2', 409);
        }
    );

    it
    (
        // 0, 0, 1
        'should POST for login with unknown username, unknown pass with ' +
        'correct captcha',
        (done) =>
        {
            login_test_wrapper
            (done, faker.internet.userName, faker.internet.password, 'a', 400);
        }
    );

    it
    (
        // 0, 1, 0
        'should POST for login with unknown username, known pass with ' +
        'incorrect captcha',
        (done) =>
        {
            login_test_wrapper
            (done, faker.internet.userName, created_password, '2', 409);
        }
    );

    it
    (
        // 0, 1, 1
        'should POST for login with unknown username, known pass with ' +
        'correct captcha',
        (done) =>
        {
            login_test_wrapper
            (done, faker.internet.userName, created_password, 'a', 400);
        }
    );

    it
    (
        // 1, 0, 0
        'should POST for login with known username, unknown pass with ' +
        'incorrect captcha',
        (done) =>
        {
            login_test_wrapper
            (done, created_user_name, faker.internet.password, '2', 409);
        }
    );

    it
    (
        // 1, 0, 1
        'should POST for login with known username, unknown pass with ' +
        'correct captcha',
        (done) =>
        {
            login_test_wrapper
            (done, created_user_name, faker.internet.password, 'a', 400);
        }
    );

    it
    (
        // 1, 1, 0
        'should POST for login with known username, known pass with ' +
        'incorrect captcha',
        (done) =>
        {
            login_test_wrapper
            (done, created_user_name, created_password, '2', 409);
        }
    );

    it
    (
        // 1, 1, 1
        'should POST for login with known username, known pass with ' +
        'correct captcha',
        (done) =>
        {
            login_test_wrapper
            (done, created_user_name, created_password, 'a', 200);
        }
    );

    it
    (
        // sending without captcha
        'should POST for login with known username, unknown pass with ' +
        'no captcha',
        (done) =>
        {
            agent
            .post('/api/0.0.0/login')
            .set('Accept', 'application/json')
            .send
            ({
                user_name    : created_user_name,
                password     : created_password,
                // captcha_text : captcha
            })
            .expect('Content-Type', /json/)
            .expect(409)
            .then((res) => assert_login(res))
            .then(() => done())
            .catch((err) => done(err));
        }
    );

    it
    (
        // sending without password but valid captcha
        'should POST for login with known username, no pass with ' +
        'correct captcha',
        (done) =>
        {
            agent
            .post('/api/0.0.0/login')
            .set('Accept', 'application/json')
            .send
            ({
                user_name    : created_user_name,
                // password     : created_password,
                captcha_text : 'a'
            })
            .expect('Content-Type', /json/)
            .expect(400)
            .then((res) => assert_login(res))
            .then(() => done())
            .catch((err) => done(err));
        }
    );
});