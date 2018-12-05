let assert = require('assert');

let user_test = require('./user.js');

let created_user_name = user_test.created_user_name;
let created_password  = user_test.created_password;

function assert_logout(res)
{
    assert(res.status === 200, 'response status 200');
    assert(res.body.success === true, '`success` is true');
    assert
    (
        typeof(res.body.was_logged_in) === 'boolean',
        '`was_logged_in` exists'
    );
    return res;
}

module.exports.run = (agent) =>
describe('logout test', () =>
{
    it
    (
        'successfully logins before testing logout',
        (done) =>
        {
            agent
            .post('/api/0.0.0/login')
            .set('Accept', 'application/json')
            .send
            ({
                user_name    : created_user_name,
                password     : created_password,
                captcha_text : 'a'
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => require('./login.js').assert_login(res))
            .then(() => done())
            .catch((err) => done(err));
        }
    );

    it('should POST to logout while logged in', (done) =>
    {
        agent
        .post('/api/0.0.0/logout')
        .expect('Content-Type', /json/)
        .then((res) => assert_logout(res))
        .then((res) =>
        {
            assert(res.body.was_logged_in === true, 'was logged in is true');
        })
        .then(() => done())
        .catch((err) => done(err));
    });

    it('should POST to logout while logged out', (done) =>
    {
        agent
        .post('/api/0.0.0/logout')
        .expect('Content-Type', /json/)
        .then((res) => assert_logout(res))
        .then((res) =>
        {
            assert(res.body.was_logged_in === false, 'was logged in is false');
        })
        .then(() => done())
        .catch((err) => done(err));
    });
});