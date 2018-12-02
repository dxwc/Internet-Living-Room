const express  = require('express');
const app      = express();
const passport = require('./middleware/auth.js');

global.creators = {};
/* example :
{
    '<user id>' : <channel id>,
}
*/
global.channels = {};
/* example :
{
    '0fe38ca7-9ca3-433d-a464-b5fce48cb798' :
    {
        creator       : <uid>,
        current_video : <video id>,
        start_time    : <new Date().getTime()>,
        video_length  : <seconds>,
        evt           : <event ch_id>
    },
}
*/

/* send out data to each channel every second */
if(!process.env.TESTING) setInterval(() =>
{
    for(ch_id in global.channels)
    {
        global.channels[ch_id].evt.eventNames().forEach((connection) =>
        {
            if
            (
                !global.channels[ch_id].current_video ||
                !global.channels[ch_id].start_time    ||
                !global.channels[ch_id].video_length  ||
                (
                    (global.channels[ch_id].video_length || 0) <
                    (new Date().getTime() - (global.channels[ch_id].start_time || 0))
                )
            )
            {
                // get next video, update and emit, if none,
                // send XOacA3RYrXk, 200, 200
                global.channels[ch_id].evt.emit
                (
                    connection,
                    'XOacA3RYrXk',
                    200,
                    200
                );
            }
            else
            {
                global.channels[ch_id].evt.emit
                (
                    connection,
                    global.channels[ch_id].current_video,
                    global.channels[ch_id].start_time,
                    global.channels[ch_id].video_length
                );
            }
        });
    }
}, 2000);


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
// TODO: Consider deleting captcha using a middleware :
// - if after n minutes or
// - if user visits non-captcha url

if(process.env.DEV && !process.env.TESTING) require('./middleware/debug.js')(app);

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