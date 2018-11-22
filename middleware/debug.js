module.exports = (app) =>
{
    app.use((req, res, next) =>
    {
        console.log(req.method, req.originalUrl);
        if(req.session)
        {
            if(req.session.captcha)
                console.log('Previously set captcha', req.session.captcha);
            if(req.session.passport)
                console.log('passport : ', req.session.passport);
        }
        else
            console.log('No previously set captcha solution found');
        if(req.method === 'POST')
            console.log('Request body :', req.body);
        console.log();

        next();
    });

    app.use('/test', (req, res) =>
    {
        return res.sendFile
        (
            require('path').join
            (
                __dirname,
                '../test/controller/api_0.0.0_manual_test.html'
            )
        );
    });
}