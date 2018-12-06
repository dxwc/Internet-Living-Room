let router = require('express').Router();
let Event  = require('events');
let xss    = require('xss-filters');
let c      = require('../controller/api_0.0.0/_common.js');

global.chat = new Event();

router.get
(
    '/main_channel/chat',
    require('../middleware/logged_in_only.js'),
    (req, res) =>
    {
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Connection', 'keep-alive');

        function event_listener(comment, by)
        {
            res.write
            (
                `data: ${
                JSON.stringify
                (
                    {
                        comment         : comment,
                        by              : by,
                        users_recieving : global.chat.eventNames().length
                    }
                )}\n\n`
            );
        }

        global.chat.on(req.session.passport.user.id, event_listener);
        res.on('close', () =>
        {
            global.chat.removeListener
            (req.session.passport.user.id, event_listener);
        });
    }
);

router.post
(
    '/main_channel/chat',
    require('../middleware/logged_in_only.js'),
    require('../middleware/captcha_control.js'),
    (req, res) =>
    {
        if(typeof(req.body.comment) !== 'string' && req.body.comment.trim().length)
        {
            return res.status(400).json
            ({
                success : false,
                reason_code : -49,
                reason_text : 'Need comment as input'
            });
        }

        try
        {
            setTimeout(() =>
            {
                global.chat.eventNames().forEach((connection) =>
                {
                    global.chat.emit
                    (
                        connection,
                        xss.inHTMLData(req.body.comment.trim()),
                        req.session.passport.user.uname
                    );
                })
            }, 0);

            let svg = c.set_captcha_get_svg(req);

            if(svg !== -1)
            {
                return res.json
                ({
                    success : true,
                    captcha : svg
                });
            }
            return res.json({ success : true });

        }
        catch(err)
        {
            console.log(err);
            return res.status(500).json
            ({
                success : false,
                reason_code : -643,
                reason_text : 'Server error, retry or contact admin'
            });
        }
    }
);

module.exports = router;