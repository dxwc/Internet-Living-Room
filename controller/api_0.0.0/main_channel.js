let router = require('express').Router();
let uuid   = require('uuid/v4');

router.get('/api/0.0.0/main_channel/connect', (req, res) =>
// TODO: allow one connection per user to a channel, or very few user can attempt
// a DOS attack
{
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'keep-alive');

    function event_listener(video_id, start_time, video_length)
    {
        if(!video_id || !start_time || !video_length) return;

        res.write
        (
            `data: ${
            JSON.stringify
            (
                {
                    video_id : video_id,
                    play_at  : video_id === 'XOacA3RYrXk' ?
                                null :
                                new Date().getTime() - start_time,
                    users_recieving : global.main_ch.evt.eventNames().length
                }
            )}\n\n`
        );
    }

    // not <user id> to allow non-registered user can connect as well
    let evt_on_name = uuid();

    global.main_ch.evt.on(evt_on_name, event_listener);
    req.session.main_ch_connected = true;

    res.on('close', () =>
    {
        global.main_ch.evt.removeListener(evt_on_name, event_listener);
        delete req.session.main_ch_connected;
    });
});

module.exports = router;