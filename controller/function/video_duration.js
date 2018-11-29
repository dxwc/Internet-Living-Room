let http = require('https');
let URL  = require('url').URL;

/**
 * @param {String} url - youtube video watch URL
 * @returns {?String} if valid, returns video id, else null
 */
function get_id(url)
{
    try
    {
        if(typeof(url) === 'string' && url.length > 0)
        {
            let id;
            if(url.match(/https:\/\/www.youtube.com\/watch\?.*\&?v=.{11}.*/) !== null)
            {
                id = new URL(url).searchParams.get('v');
                return id ? id : null;
            }
            else if(url.match(/https:\/\/youtu.be\/...........\??.*/) !== null)
            {
                id = url.substr('https://youtube.be/' + 19, 11);
                return id ? id : null;
            }
            else return null;
        }
        else return null;
    }
    catch(err)
    {
        console.error(err);
        return null;
    }
}

/**
 * @param {String} url - youtube video watch URL
 * @returns {Promise} Resolves with the downloaded content, reject on error
 */
function download(url)
{
    return new Promise((resolve, reject) =>
    {
        let data = '';
        http.get(url, (res) =>
        {
            res.on('data',  (chunk) => data += chunk);
            res.on('end',   ()      => resolve(data));
            res.on('error', (err)   => reject(err));
        })
        .on(('error'), (err) => reject(err));
    });
}

module.exports.get_id   = get_id;
module.exports.download = download;