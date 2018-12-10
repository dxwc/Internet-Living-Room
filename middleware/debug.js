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
        console.log('Number of channels:', Object.keys(global.channels).length);
        console.log('Number of hosts:', Object.keys(global.creators).length);
        console.log();

        next();
    });

    let path = require('path');

    app.use('/test', (req, res) =>
    {
        if(req.originalUrl === '/test/api_sign_up')
        {
            return res.sendFile
            (
                path.join
                (
                    __dirname,
                    '../test/controller/api_0.0.0/manual/api_sign_up.html'
                )
            );
        }
        else if(req.originalUrl === '/test/api_login')
        {
            return res.sendFile
            (
                path.join
                (
                    __dirname,
                    '../test/controller/api_0.0.0/manual/api_login.html'
                )
            );
        }
        else if(req.originalUrl === '/test/api_logout')
        {
            return res.sendFile
            (
                path.join
                (
                    __dirname,
                    '../test/controller/api_0.0.0/manual/api_logout.html'
                )
            );
        }
        else if(req.originalUrl === '/test/channel_connect')
        {
            return res.sendFile
            (
                path.join
                (
                    __dirname,
                    '../test/controller/channel_connect.html'
                )
            );
        }

        else if(req.originalUrl === '/test/vote'){
             return res.sendFile
             (
                path.join
                (
                    __dirname,
                    '../test/controller/api_0.0.0/manual/vote.html'
                )
            );
         }
        else if(req.originalUrl === '/test/main_channel_connect')
        {
            return res.sendFile
            (
                path.join
                (
                __dirname,
                    '../test/controller/main_channel_connect.html'
                )
            );
        }
        else if(req.originalUrl === '/test/main_channel_chat')
        {
            return res.sendFile
            (
                path.join
                (
                    __dirname,
                    '../test/controller/main_channel_chat.html'
                )
            );
        }
        else if(req.originalUrl === '/test/api_video_submission')
        {
            return res.sendFile
            (
                path.join
                (
                    __dirname,
                    '../test/controller/api_0.0.0/manual/api_video_submission.html'
                )
            );
        }
        else if(req.originalUrl === '/test/api_getting_video')
        {
            return res.sendFile
            (
                path.join
                (
                    __dirname,
                    '../test/controller/api_0.0.0/manual/api_getting_video.html'
                )
            );
        }
        else
        {
            return res.sendFile
            (
                path.join
                (
                    __dirname,
                    '../test/controller/api_0.0.0/manual/api_index.html'
                )
            );
        }
    });
}