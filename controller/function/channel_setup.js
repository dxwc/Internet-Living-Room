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
                .then((video) =>
                // TODO: find out whether promise block would cache in global
                // variables or update them properly
                {
                    if(!video.id || typeof(video.length) !== 'number')
                        throw new Error('Invalid data from db');

                    global.channels[ch_id].current_video = video.id;
                    global.channels[ch_id].start_time    = new Date().getTime()
                                                           + 1000;
                    global.channels[ch_id].video_length  = video.length;

                    global.channels[ch_id].evt.emit
                    (
                        connection,
                        global.channels[ch_id].current_video,
                        global.channels[ch_id].start_time,
                        global.channels[ch_id].video_length
                    );
                })
                .catch((err) =>
                {
                    if(process.env.DEV && !process.env.TESTING)
                    {
                        if(err.code === 'NO_VIDEO')
                            console.error('NO_VIDEO', ch_id);
                        else
                        {
                            console.error('Video data fetch error:');
                            console.error(err);
                        }
                    }

                    global.channels[ch_id].evt.emit
                    (
                        connection,
                        'XOacA3RYrXk',
                        200,
                        200
                    );
                })
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