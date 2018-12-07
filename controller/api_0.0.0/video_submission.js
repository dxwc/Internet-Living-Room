let router          = require('express').Router();
let op              = require('../../model/api_operations');
let getVideoInfo    = require('../function/video_info');

router.post(
    '/api/0.0.0/submit_video',
    require('../../middleware/logged_in_only.js',
    (req, res) => {
        // verify all the data come thru
        // need to have the url, by, and channel

        let url = req.body.url;
        let who_submit = req.body.who_submit;
        let which_channel = req.body.which_channel;

        getVideoInfo(url).then(function (result) {
            // if we are able to get the video's info
            const ret_value = op.submit_video(result.id, which_channel, result.length, who_submit);
            if (ret_value[1]) { // if created
                return res.status(201).json(
                    {
                        created: true
                    });
            } else {
                return res.status(304).json(
                    {
                        created: false
                    }
                );
            }
        }, function (err) { // if getting the video's info failed
            console.log(err);
            return res.status(304).json(
                {
                    created: false
                }
            );
        });
    });

router.get('/api/0.0.0/getting/video/:channel', (req, res) => {
    // using channel id to get a list of video that were submitted by the user.
    const channel_id = req.params.channel;
    if(typeof(channel_id) !== 'UUID')
    op.get_video_list(channel_id).then((result) => {
        return res.status(200).json(result);
    }).catch((err) => {
        return res.status(500).json ({
            success : false,
            reason  : "the channel might not exist or there is no more video in that channel."
        });
    })
});

module.exports = router;