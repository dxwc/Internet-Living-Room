let user_test   = require('./user.js');
let auth_test   = require('./auth.js');
let login_test  = require('./login.js');
let logout_test = require('./logout.js');

let http_server;
let agent = require('supertest').agent(require('../../../../index.js').app);

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

    auth_test.captcha_generation(agent);
    user_test.sign_up(agent);
    user_test.user_info(agent);
    login_test.run(agent);
    logout_test.run(agent);
});