/**
const app = require('express')();

app.use(require('body-parser').urlencoded({ extended: false }));
app.use(require('body-parser').json());

app.use(require('./controller/home.js'));
app.use(require('./controller/api_0.0.0/user.js'));
app.use(require('./controller/404.js')); // last router to use

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
module.exports.start  = start;**/
const bodyParser = require('body-parser');
const express = require('express');
const model = require('./model');

const PORT = process.env.PORT || 9001;

const app = express();
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const passport = require('./middleware/auth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Uncomment the following if you want to serve up static assets.
// (You must create the public folder)
/*
app.use(express.static('./public'));
*/

// Uncomment the following if you want to use handlebars
// on the backend. (You must create the views folder)
/*
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
  layoutsDir: './views/layouts',
  defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views/`);
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(expressSession(({
  secret: 'change this part',
  resave: false,
  saveUninitialized: true,
})));

app.use(passport.initialize());
app.use(passport.session());

// Load up all of the controllers
const controller = require('./controller');
app.use(controller)


// First, make sure the Database tables and models are in sync
// then, start up the server and start listening.
model.sequelize.sync({force: false})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is up and running on port: ${PORT}`)
    });
  });
