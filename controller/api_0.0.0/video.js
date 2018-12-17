let router       = require('express').Router();
let op           = require('../../model/api_operations.js');
let getVideoInfo = require('../function/video_info.js');
let val          = require('validator');

router.post
(
    '/api/0.0.0/submit_video',
    require('../../middleware/logged_in_only.js'),
    require('../../middleware/captcha_control.js'),
    (req, res) =>
    {
        let url           = req.body.url;
        let who_submit    = req.session.passport.user.id;
        let which_channel = req.body.which_channel;

        if
        (
            typeof(url) !== 'string'           ||
            url.length === 0                   ||
            typeof(which_channel) !== 'string' ||
            !val.isUUID(which_channel, 4)
        )
        {
            return res.status(400).json
            ({
                success     : false,
                reason_code : 887,
                reason_text : 'Invalid request'
            });
        }

        getVideoInfo(url)
        .then((result) =>
        {
            // if we are able to get the video's info
            return op.submit_video
            (
                result.id,
                which_channel,
                result.length,
                who_submit
            );
        })
        .then((ret_value) =>
        {
            ret_value.success = true;
            return res.status(200).json(ret_value);
        })
        .catch((err) =>
        {
            if(err.code === 'INVALID_URL' || err.code === 'PARSE_ERROR')
            {
                return res.status(400).json
                ({
                    success     : false,
                    reson_code  : 888,
                    reason_text : 'Invalid video URL'
                });
            }
            else if(err.code === 'NO_CHANNEL')
            {
                return res.status(503).json
                ({
                    success     : false,
                    reason_code : 889,
                    reason_text : `Channel the video was submitted for doesn't exist`
                });
            }
            else
            {
                console.error(err);
                return res.status(500).json
                ({
                    success     : false,
                    reason_code : 890,
                    reason_text : 'Unexpected error, retry or contact admin'
                });
            }
        });
    }
);

router.get
(
    '/api/0.0.0/getting_video/:channel',
    (req, res) =>
    {
        if
        (
            typeof(req.params.channel) !== 'string' ||
            req.params.channel.length === 0         ||
            !val.isUUID(req.params.channel, 4)
        )
        {
            return res.status(400).json
            ({
                success     : false,
                reason_code : 787,
                reason_text : 'Invalid request'
            });
        }

        op.get_video_list(req.params.channel)
        .then((result) =>
        {
            return res.status(200).json
            ({
                success : true,
                arr : result
            });
        })
        .catch((err) =>
        {
            console.log(err);
            return res.status(500).json
            ({
                success : false,
                reason_code : 790,
                reason_text : 'Unexpected error, retry or contact admin'
            });
        });
    }
);

module.exports = router;