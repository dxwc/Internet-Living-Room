let router = require('express').Router();
let uuid   = require('uuid/v4');
let Event  = require('events');
let val    = require('validator');
let op     = require('../model/api_operations');

router.get('/channel/:id', (req, res) =>
{
    if
    (
        val.isUUID(req.params.id, 4) &&
        global.channels.hasOwnProperty(req.params.id)
    )
    {
        let the_channel = global.channels[req.params.id];

        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Connection', 'keep-alive');

        function event_listener(video_id, play_at)
        {
            res.write
            (
                `data: ${
                JSON.stringify
                (
                    {
                        video_id : video_id,
                        play_at : play_at,
                        users_recieving : the_channel.evt.eventNames().length-1
                    }
                )}\n\n`
            );
        }

        let evt_on_name = uuid();

        evt.on(evt_on_name, event_listener);
        res.on('close', () =>
        {
            the_channel.evt.removeListener(evt_on_name, event_listener);
        });
    }
    else return res.status(404).json
    ({
        success : false,
        reason_code : -45,
        reason_text : 'No such channel found'
    });
});

router.get('/channel', require('../middleware/logged_in_only.js'), (req, res) =>
{
    // FIXME
    op.create_channel(req.session.passport.user.id)
    .then((channel_id) =>
    {
        global.creators[req.session.passport.user.id] = channel_id;
        global.channels[channel_id] =
        {
            creator : req.session.passport.user.id,
            evt : new Event(),
            // current_video : <video id>,
            // current_time  : <time in second>l
            // video_length  : <total time in seconds>,
            interval_id : setInterval(() =>
            {
                this.evt.eventNames().forEach((name) =>
                {
                    if(this.video_length - 1 > current_time)
                    // while video is not done, update current time by 1 second, every
                    // second interval
                    {
                        this.evt.emit(name, this.current_video, ++this.current_time);
                    }
                    else
                    {
                        this.current_time = 0;
                        // TODO: fetch next video and length from db, save to property
                        // do not emit, emit in the next iteration
                    }

                });
            }, 1000)
        };

        return res.json
        ({
            success : true,
            channel_id : an_uuid
        });
    })
    .catch((err) =>
    {
        console.error(err);
        return res.status(500).json
        ({
            success : false,
            reason_code : -77,
            reason_code : 'Error creating channel'
        });
    });
});

module.exports = router;