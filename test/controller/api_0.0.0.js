const faker   = require('faker');
const assert  = require('assert');
const request = require('supertest');
const val     = require('validator');

let server;

describe('TESTING /api/0.0.0/sign_up', () =>
{
    beforeEach(() =>
    {
        server = require('../../index.js').server;
    });

    afterEach(() =>
    {
        if(server) server.close();
    });

    it('should POST valid data successfully to /api/0.0.0/sign_up', (done) =>
    {
        request(server)
        .post('/api/0.0.0/sign_up')
        .set('Accept', 'application/json')
        .send
        ({
            user_name : faker.internet.userName(),
            password : faker.internet.password()
        })
        .expect('content-type', /json/)
        .then((res) =>
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
                // TODO
            }
        })
        .then(() => done())
        .catch((err) => done(err));
    });
});