const faker   = require('faker');
const assert  = require('assert');
const val     = require('validator');
const db      = require('../../../../model/setup.js');

let created_user_name = faker.internet.userName();
let created_password = faker.internet.password();

// let agent = request.agent(require('../../../../index.js').app);

function assert_sign_up(res)
{
    assert
    (
        typeof(res.body.success) === 'boolean',
        'boolean `success` field exists'
    );

    if(res.body.success)
    {
        assert(res.status === 201, '`success` true, so 201');
        assert(res.body.id, '`success` true, so `id` field exists');
        assert(typeof(res.body.id) === 'string', '`id` is a string');
        assert(val.isUUID(res.body.id, 4), '`id` is UUID4');
    }
    else
    {
        assert
        (
            res.status === 200 || res.status === 400 || res.status === 500,
            'Unsuccessful response can be 200, 400, or 500'
        );

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

        if(res.status === 200)
        {
            assert
            (
                res.body.reason_code === -1,
                'If username taken, send `reason_code` of -1'
            );
        }
        else if(res.status === 400)
        {
            assert
            (
                res.body.reason_code === -2,
                'If invalid data/request, send `reason_code` of -2'
            );
        }
        else if(res.reason_code === 500)
        {
            assert
            (
                res.body.reason_code === -3,
                'If other server error/exception, send `reason_code` of -3'
            );
        }
    }
}

module.exports.sign_up = (agent) =>
describe('sign up test', () =>
{
    function check_sign_up(done, user_name, password)
    {
        agent
        .get('/api/0.0.0/auth')
        .expect('Content-Type', /json/)
        .then(() =>
        {
            return agent
            .post('/api/0.0.0/user')
            .set('Accept', 'application/json')
            .send
            ({
                user_name : user_name,
                password : password,
                captcha_text : 'a'
            })
            .expect('Content-Type', /json/)
        })
        .then((res) => assert_sign_up(res, user_name, password))
        .then(() => done())
        .catch((err) => done(err));
    }

    it('should POST valid data successfully to /api/0.0.0/user', (done) =>
    {
        check_sign_up(done, created_user_name, created_password);
    });

    it
    (
        'should POST valid but duplicate data unsuccessfully to /api/0.0.0/user',
        (done) =>
        {
            check_sign_up(done, 'john', faker.internet.password());
        }
    );

    it
    (
        'should POST invalid data unsuccessfully to /api/0.0.0/user',
        (done) =>
        {
            check_sign_up(done, faker.internet.userName());
        }
    );
});


function assert_user_info(res)
{
    assert
    (
        typeof(res.body.success) === 'boolean',
        'boolean `success` field exists'
    );

    if(res.body.success)
    {
        assert(res.status === 200, '`success` true, so 200');

        assert
        (
            typeof(res.body.user_name) === 'string',
            '`user_name` field exists and is string'
        );

        assert
        (
            res.body.hasOwnProperty('first_name'),
            '`first_name` field exists'
        );

        assert
        (
            res.body.hasOwnProperty('last_name'),
            '`last_name` field exists'
        );

        assert
        (
            res.body.hasOwnProperty('registered_on'),
            '`registered_on` field exists'
        );
    }
    else
    {
        assert
        (
            res.status === 200 || res.status === 400 || res.status === 500,
            'Unsuccessful response can be 200, 400, or 500'
        );

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

        if(res.status === 200)
        {
            assert
            (
                res.body.reason_code === -1,
                'If no such user exists, send `reason_code` of -1'
            );
        }
        else if(res.status === 400)
        {
            assert
            (
                res.body.reason_code === -2,
                'If invalid UUID, send `reason_code` of -2'
            );
        }
        else if(res.reason_code === 500)
        {
            assert
            (
                res.body.reason_code === -3,
                'If other server error/exception, send `reason_code` of -3'
            );
        }
    }
}

module.exports.user_info = (agent) =>
describe('user info test', () =>
{
    it('should successfully GET /api/0.0.0/user/<ID> with valid user ID', (done) =>
    {
        db.user.findOne() // assumes there exists at least one
        .then((res) =>
        {
            agent
            .get('/api/0.0.0/user/' + res.dataValues.id)
            .expect('Content-Type', /json/)
            .then((res) => assert_user_info(res))
            .then(() => done())
            .catch((err) => done(err));
        });
    });

    it('should unsuccessfully GET /api/0.0.0/user/<ID> with valid UUID', (done) =>
    {
        agent
        .get('/api/0.0.0/user/' + faker.random.uuid())
        .expect('Content-Type', /json/)
        .then((res) => assert_user_info(res))
        .then(() => done())
        .catch((err) => done(err));
    });

    it('should unsuccessfully GET /api/0.0.0/user/<ID> with invalid UUID', (done) =>
    {
        agent
        .get('/api/0.0.0/user/' + faker.random.alphaNumeric(Math.random() * 100))
        .expect('Content-Type', /json/)
        .then((res) => assert_user_info(res))
        .then(() => done())
        .catch((err) => done(err));
    });
});

module.exports.created_user_name = created_user_name;
module.exports.created_password  = created_password;