const faker   = require('faker');
const assert  = require('assert');
const request = require('supertest');
const val     = require('validator');
const db      = require('../../../../model/setup.js');

// TODO: breakup into multiple files

let http_server;
let created_user_name;
let created_password;

describe('TESTING /api/0.0.0/user', () =>
{
    before((done) =>
    {
        require('../../../../index.js').start()
        .then((res)  => { http_server = res; done(); })
        .catch((err) => { done(err); });
    });

    after(() =>
    {
        if(http_server) http_server.close();
    });

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

    function check_sign_up(done, user_name, password)
    {
        request(http_server)
        .post('/api/0.0.0/user')
        .set('Accept', 'application/json')
        .send
        ({
            user_name : user_name,
            password : password
        })
        .expect('Content-Type', /json/)
        .then((res) => assert_sign_up(res, user_name, password))
        .then(() => done())
        .catch((err) => done(err));
    }

    it('should POST valid data successfully to /api/0.0.0/user', (done) =>
    {
        created_user_name = faker.internet.userName();
        created_password = faker.internet.password();
        check_sign_up
        (done, created_user_name, created_password);
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

// --------------------------------------------------------------------

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

    it('should successfully GET /api/0.0.0/user/<ID> with valid user ID', (done) =>
    {
        db.user.findOne() // assumes there exists at least one
        .then((res) =>
        {
            request(http_server)
            .get('/api/0.0.0/user/' + res.dataValues.id)
            .expect('Content-Type', /json/)
            .then((res) => assert_user_info(res))
            .then(() => done())
            .catch((err) => done(err));
        });
    });

    it('should unsuccessfully GET /api/0.0.0/user/<ID> with valid UUID', (done) =>
    {
        request(http_server)
        .get('/api/0.0.0/user/' + faker.random.uuid())
        .expect('Content-Type', /json/)
        .then((res) => assert_user_info(res))
        .then(() => done())
        .catch((err) => done(err));
    });

    it('should unsuccessfully GET /api/0.0.0/user/<ID> with invalid UUID', (done) =>
    {
        request(http_server)
        .get('/api/0.0.0/user/' + faker.random.alphaNumeric(Math.random() * 100))
        .expect('Content-Type', /json/)
        .then((res) => assert_user_info(res))
        .then(() => done())
        .catch((err) => done(err));
    });

    // ---------------------------------------------------------------------

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

    let agent = request.agent(require('../../../../index.js').app);

    it('should GET captcha successfully from /api/0.0.0/auth', (done) =>
    {
        // request(http_server) // captcha is set to 'a' for process.env.TESTING
        agent
        .get('/api/0.0.0/auth')
        .expect('Content-Type', /json/)
        .then((res) => assert_get_captcha(res))
        .then(() => done())
        .catch((err) => done(err));
    });

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
            assert(typeof(res.body.id) === 'string', 'Receieve user logged in id');
            assert(val.isUUID(res.body.id, 4), 'User ID is UUID');
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

    // TODO: logout after each login attempt
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


    // ------------------------

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

    it
    (
        // 1, 1, 1
        'should POST for login with known username, known pass with ' +
        'correct captcha',
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
            .then((res) => assert_login(res))
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