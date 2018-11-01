const faker   = require('faker');
const assert  = require('assert');
const request = require('supertest');
const val     = require('validator');

let http_server;

describe('TESTING /api/0.0.0/sign_up', () =>
{
    beforeEach((done) =>
    {
        require('../../index.js').start()
        .then((res)  => { http_server = res; done(); })
        .catch((err) => { done(err); });
    });

    afterEach(() =>
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
        .post('/api/0.0.0/sign_up')
        .set('Accept', 'application/json')
        .send
        ({
            user_name : user_name,
            password : password
        })
        .expect('Content-Type', /json/)
        .then((res) =>
        {
            assert_sign_up
            (res, faker.internet.userName(), faker.internet.password());
        })
        .then(() => done())
        .catch((err) => done(err));
    }

    it('should POST valid data successfully to /api/0.0.0/sign_up', (done) =>
    {
        check_sign_up
        (done, faker.internet.userName(), faker.internet.password());
    });

    it
    (
        'should POST valid but duplicate data unsuccessfully to /api/0.0.0/sign_up',
        (done) =>
        {
            check_sign_up(done, 'john', faker.internet.password());
        }
    );

    it
    (
        'should POST invalid data unsuccessfully to /api/0.0.0/sign_up',
        (done) =>
        {
            delete process.env.TESTING;
            check_sign_up(done, faker.internet.userName());
        }
    )
});