let router       = require('express').Router();
let op           = require('../../model/api_operations.js');
let getVideoInfo = require('../function/video_info.js');

router.post
(
    '/api/0.0.0/main_channel_submit_video',
    require('../../middleware/logged_in_only.js'),
    require('../../middleware/captcha_control.js'),
    (req, res) =>
    {
        let url           = req.body.url;
        let who_submit    = req.session.passport.user.id;

        if(typeof(url) !== 'string' || url.length === 0)
        {
            return res.status(400).json
            ({
                success     : false,
                reason_code : 917,
                reason_text : 'Invalid request'
            });
        }

        getVideoInfo(url)
        .then((result) =>
        {
            // if we are able to get the video's info
            return op.main_ch_submit_video
            (
                result.id,
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
                    reson_code  : 918,
                    reason_text : 'Invalid video URL'
                });
            }
            else
            {
                console.error(err);
                return res.status(500).json
                ({
                    success     : false,
                    reason_code : 920,
                    reason_text : 'Unexpected error, retry or contact admin'
                });
            }
        });
    }
);

module.exports = router;