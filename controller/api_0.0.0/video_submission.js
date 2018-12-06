let router          = require('express').Router;
let op              = require('../../model/api_operations');
let getVideoInfo    = require('../function/video_info');

router.post('/api/0.0.0/submit_video', (req, res) => {
    // verify all the data come thru
    // need to have the url, by, and channel

    let url             = req.body.url;
    let who_submit      = req.body.who_submit;
    let which_channel   = req.body.which_channel;
    let info            = getVideoInfo.get_info(url);

    info.then(function(result) {
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
    }, function(err) {
        console.log(err);
        return res.status(304).json(
            {
                created: false
            }
        );
    });
});

router.get('/api/0.0.0/getting_video/:channel', (req, res) => {
    // using channel id to get a list of video that were submitted by the user.
    // check if it is a valid channel id
    
});

module.exports = router;