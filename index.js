const express  = require('express');
const app      = express();
const passport = require('./middleware/auth.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use
(
    require('express-session')
    ({
        secret            : process.env.SESSION_SECRET || 'CHANGE_ME',
        resave            : true,
        saveUninitialized : true
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('./view/public/'));

require('ejs').delimiter = '?';
app.set('view engine', 'ejs');
app.set('views', './view/templates/');
// TODO: Consider deleting captcha using a middleware :
// - if after n minutes or
// - if user visits non-captcha url

if(process.env.DEV && !process.env.TESTING) require('./middleware/debug.js')(app);

require('./controller/function/channel_setup.js');
require('./controller/function/main_channel_setup.js');
app.use(require('./controller/'));

let db = require('./model/setup.js');
let http_server;

function start()
{
    return db.connect()
    .then(() =>
    {
        http_server = app.listen(process.env.PORT || '9001');

        http_server.on('error', (err) =>
        {
            console.error('Error starting server:');
            console.error(err);
            if(db.sequelize)
                db.sequelize.close().then(() => process.exit(1));
            else process.exit(1);
        });

        http_server.on('close', () =>
        {
            if(db.sequelize) db.sequelize.close();
        });

        return new Promise((resolve, reject) =>
        {
            http_server.on('listening', () =>
            {
                console.info
                (
                    '- HTTP server started,',
                    http_server.address().family === 'IPv6' ?
                        'http://[' + http_server.address().address + ']:'
                        + http_server.address().port
                        :
                        'http://' + http_server.address().address + ':'
                        + http_server.address.port
                );

                return resolve(http_server);
            });
        });
    });
}

if(!process.env.TESTING) start();

module.exports.app    = app;
module.exports.start  = start;