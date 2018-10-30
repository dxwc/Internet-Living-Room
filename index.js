const app = require('express')();

app.use(require('body-parser').urlencoded({ extended: false }));
app.use(require('body-parser').json());

app.use(require('./controller/home.js'));
app.use(require('./controller/api_0.0.0/sign_up.js'));
app.use(require('./controller/404.js')); // last router to use

const server = app.listen(process.env.PORT || '9001', (err) =>
{
    if(err) console.error('Error starting server:', err);
    else
    {
        console.info('Server started,', server.address().family === 'IPv6' ?
            'http://[' + server.address().address + ']:'+ server.address().port :
            'http://' + server.address().address + ':' + server.address.port
        );
    }
});

module.exports.app    = app;
module.exports.server = server;