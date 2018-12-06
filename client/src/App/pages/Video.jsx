import React from 'react';
import YouTube from 'react-youtube';

// still working on
// references: 
// https://github.com/troybetz/react-youtube
// https://auth0.com/blog/developing-real-time-web-applications-with-server-sent-events/

/*class player extends React.Component {
    cosntructor(props) {
        super(props);
        this.state = {
            video_id: '',
            play_at: '',
            viewer: ''
        };
        
        this.eventSource = new EventSource('http://localhost:9001/main_channel/connect');
    }
} */

class player extends React.Component {
    render() {
        const opts = {
            height: '',
            width: '',
            playerVars: {
                autoplay: 1,
                controls: 0,
                disablekb: 1,
                enablejsapi: 1,
                rel: 0,
                showinfo: 0
            }
        };

        return (
            <YouTube 
                videoId=""
                opts= {opts}
                onReady={this._onReady}
            />
        );  
    }

    _onReady(event) {
        event.target.pauseVideo();
    }
}