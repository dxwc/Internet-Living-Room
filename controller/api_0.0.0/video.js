let router       = require('express').Router();
let op           = require('../../model/api_operations.js');
let getVideoInfo = require('../function/video_info.js');

router.post
(
    '/api/0.0.0/submit_video',
    require('../../middleware/logged_in_only.js'),
    (req, res) =>
    {
        // verify all the data come thru
        // need to have the url, by, and channel

        let url           = req.body.url;
        let who_submit    = req.session.passport.user.id;
        let which_channel = req.body.which_channel;

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
            if(ret_value[1]) return res.status(201).json(ret_value); // if created
            else             return res.status(409).json(ret_value);
        })
        .catch((err) =>
        {
            return res.status(500).json
            ({
                created : false
            });
        });
    }
);

router.get
(
    '/api/0.0.0/getting_video/:channel',
    (req, res) =>
    {
        // using channel id to get a list of video that were submitted by the user.
        op.get_video_list(req.params.channel)
        .then((result) =>
        {
            return res.status(200).json(result);
        })
        .catch((err) =>
        {
            return res.status(500).json
            ({
                success : false,
                reason  : "the channel might not exist or there is no more" +
                          "video in that channel."
            });
        });
    }
);

module.exports = router;