let Event  = require('events');

global.main_ch =
{
    // current_video : <video id>,
    // start_time    : <new Date().getTime()>,
    // video_length  : <seconds>,
    evt              : new Event()
};

if(!process.env.TESTING) setInterval(() =>
{
    global.main_ch.evt.eventNames().forEach((connection) =>
    {
        if
        (
            !global.main_ch.current_video ||
            !global.main_ch.start_time    ||
            !global.main_ch.video_length  ||
            (
                global.main_ch.video_length > 0 &&
                global.main_ch.start_time       &&
                (
                    (new Date().getTime() - global.main_ch.start_time)/1000 >
                    global.main_ch.video_length
                )
            )
        )
        {
            require('../../model/api_operations.js').get_next_main_ch_video()
            .then((res) =>
            {
                if
                (
                    !res                            ||
                    !res.id                         ||
                    typeof(res.length) !== 'number'
                )
                {
                    global.main_ch.current_video = null;
                    global.main_ch.video_length  = null;
                    global.main_ch.start_time    = null;
                }
                else
                {
                    global.main_ch.current_video = res.id;
                    global.main_ch.video_length  = res.length;
                    global.main_ch.start_time    = new Date().getTime() + 200;

                    global.main_ch.evt.emit(connection);
                }

                global.main_ch.evt.emit(connection);

            })
            .catch((err) =>
            {
                console.error(err);
            });
        }
        else
        {
            global.main_ch.evt.emit(connection);
        }
    });
}, 2000);