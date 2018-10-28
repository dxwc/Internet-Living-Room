const app = require('express')();

app.use(require('body-parser').urlencoded({ extended: false }));
app.use(require('body-parser').json());

app.use(require('./controller/home.js'));
app.use(require('./controller/404.js')); // last router to use

const server = app.listen(process.env.PORT || '9001', (err) =>
{
    if(err) console.error('Error starting server:', err);
    else    console.info ('Server listening on', server.address());
});