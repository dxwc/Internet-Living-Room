let router = require('express').Router();
let uuid   = require('uuid/v4');

router.get('/api/0.0.0/main_channel/connect', (req, res) =>
// TODO: allow one connection per user to a channel, or very few user can attempt
// a DOS attack
{
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'keep-alive');

    function event_listener()
    {
        if
        (
            !global.main_ch.current_video                  ||
            typeof(global.main_ch.start_time) !== 'number' ||
            !global.main_ch.video_length
        )
        {
            return;
        }

        res.write
        (
            `data: ${
            JSON.stringify
            (
                {
                    video_id : global.main_ch.current_video,
                    play_at  : global.main_ch.current_video === 'XOacA3RYrXk' ?
                            null :
                            (new Date().getTime() - global.main_ch.start_time)/1000,
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