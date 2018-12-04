global.creators = {};
/* example :
{
    '<user id>' : <channel id>,
}
*/
global.channels = {};
/* example :
{
    '0fe38ca7-9ca3-433d-a464-b5fce48cb798' :
    {
        creator       : <uid>,
        current_video : <video id>,
        start_time    : <new Date().getTime()>,
        video_length  : <seconds>,
        evt           : <event ch_id>
    },
}
*/

/* send out data to each channel every second */
if(!process.env.TESTING) setInterval(() =>
{
    for(ch_id in global.channels)
    {
        global.channels[ch_id].evt.eventNames().forEach((connection) =>
        {
            if
            (
                !global.channels[ch_id].current_video ||
                !global.channels[ch_id].start_time    ||
                !global.channels[ch_id].video_length  ||
                (
                    (global.channels[ch_id].video_length || 0) <
                    (new Date().getTime() - (global.channels[ch_id].start_time || 0))
                )
            )
            {
                require('../../model/api_operations.js').get_next_video(ch_id)
                .then((res) =>
                {
                    if
                    (
                        !res[1]                            ||
                        !res[1].id                         ||
                        !res[1].channels                   ||
                        typeof(res[1].length) !== 'number'
                    )
                    {
                        global.channels[res[0]].evt.emit
                        (
                            connection,
                            'XOacA3RYrXk',
                            200,
                            200
                        );
                    }
                    else if(global.channels[res[0]]) // if channel still exists
                    {
                        global.channels[res[0]].current_video = res[1].id;
                        global.channels[res[0]].video_length  = res[1].length;
                        global.channels[res[0]].start_time    = new Date().getTime()
                                                                + 1000;

                        global.channels[res[0]].evt.emit
                        (
                            connection,
                            global.channels[res[0]].current_video,
                            global.channels[res[0]].start_time,
                            global.channels[res[0]].video_length
                        );
                    }

                })
                .catch((err) =>
                {
                    console.error(err);
                });
            }
            else
            {
                global.channels[ch_id].evt.emit
                (
                    connection,
                    global.channels[ch_id].current_video,
                    global.channels[ch_id].start_time,
                    global.channels[ch_id].video_length
                );
            }
        });
    }
}, 2000);