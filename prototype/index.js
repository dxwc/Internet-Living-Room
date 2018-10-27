const app   = require('express')();
const path  = require('path');
const Event = require('events');

app.get('/', (req, res) =>
{
    // Sends the 'index.html' file. Used 'path' (Node.js build in library)
    // since convention for setting path is different per operation system,
    // this will work for all this program this server is run from
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Creating a global event object. This will be used to create a custom event
// listener for each user connected on SSE
const evt = new Event();

// The max_emit global variable is a quick way to come up with unique event listener
// name by incrementing the number and turning it into a string
global.max_emit = 0;

// Data, hardcoded as objects in array for prototype here
let vid_arr =
[
    {
        video_id : 'Cbrh1jg2gQA',
        video_length : 68
    },
    {
        video_id : 'vmdITEguAnE',
        video_length : 861
    },
    {
        video_id : 'BuoY_agvSs8',
        video_length : 4
    }
];

let vid_arr_index = -1; // to remember index number of last video sent to client

let fuytj = true;
// Stands for : first user yet to join, this determines when to start calculating,
// setting variables and start sending data to users

// To keep track of when a video was told to start (in server's time) :
let video_start_server_time = -1;

// To keep track of last time client was told to play (in server's time) :
let play_at_time = -1;

function emit_the_event(event_name)
{
    // if starting everything for the first time or a video just ended :
    if
    (
        fuytj ||
        (vid_arr_index >= 0 &&
        play_at_time === vid_arr[vid_arr_index].video_length)
    )
    {
         // if starting for first time, next time it wont't be considered as such
        if(fuytj) fuytj = false;

        // if on the last item of the array, start from beginging again,
        // else go to the next item of the array
        if(vid_arr_index + 1 >= vid_arr.length) vid_arr_index = 0;
        else                                    ++vid_arr_index;

        // user will be sent to play the next/first video starting at zero
        // seconds :
        play_at_time = 0;

        // remember the server time when the video was told to start:
        video_start_server_time = new Date();
    }
    // if the time since video started from now is >= length of the video
    // set the exact length of the video (ie. end of the video) for play_at_time
    // for user to send. This exact end time set will be used on next
    // iteration of this function which will go through the first if section
    else if
    (
        (new Date().getTime() - video_start_server_time.getTime())/1000 >=
        vid_arr[vid_arr_index].video_length
    )
    {
        play_at_time = vid_arr[vid_arr_index].video_length;
    }
    // if the time since video started from now is still < length of the video
    // just send the time elasped since video started as the time all client
    // should be playing the video at
    // (NOTE: if there are constatnt skipping or lag, try adding + 0.5 before
    // comparison to each to add a error rate since it takes small time to do all
    // these calculation before it gets sent to user )
    else if
    (
        (new Date().getTime() - video_start_server_time.getTime())/1000 <
        vid_arr[vid_arr_index].video_length
    )
    {
        play_at_time =
            (new Date().getTime() - video_start_server_time.getTime())/1000;
    }

    // finally emit the customly named event with the video id and time it should
    // be playing at
    evt.emit
    (
        event_name,
        vid_arr[vid_arr_index].video_id,
        play_at_time
    );
}

app.get('/sse', (req, res) =>
{
    // Necessary HTTP headers for SSE event of the type needed
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'keep-alive');

    // an arbiatary way of setting a unique event name per user
    let event_name = String(++global.max_emit);

    // when the `event_name` event is emitted with the data, it will be handed
    // over to this function
    function event_listener(video_id, play_at)
    {
        res.write // writes to response before sending, for SSE, also sends
        (
            `data: ${
            // Sending JSON, but since SSE will send text, turning into string first
            JSON.stringify
            (
                {
                    video_id :video_id,
                    play_at : play_at,
                    users_recieving : evt.eventNames().length-1
                }
            )}\n\n` // SSE event requires every messege sent with two newline
        );
    }

    // When the created event is emitted, run event_listener function
    evt.on(event_name, event_listener);

    // When the connection 'closes' event is emitted (when user disconnects),
    // remove the event_listener function attached to custom event previously
    // created for that user to free up some RAM
    res.on('close', () => evt.removeListener(event_name, event_listener));
});

// Runs the function every second (1000 ms)
setInterval
(
    // emits (by calling the emit_the_event function whcih does it) every custom
    // event that was assigned to each connected user
    () => evt.eventNames().forEach((evt_name) => emit_the_event(evt_name)),
    1000
);

// starts express HTTP server:
const server = app.listen('9001', (err) =>
{
    if(err) console.error('Error starting server:', err);
    else    console.info ('Server listening on', server.address());
    // On most computer by default should run on http://localhost:9001
});