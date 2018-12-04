let http = require('https');
let URL  = require('url').URL;

// TODO: promisify all functions here to easily collect all errors in one place

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

function parse_length(data)
{
    try
    {
        let loc1 = data.indexOf(`"length_seconds":"`);
        let loc2 = data.indexOf('"', loc1 + 18);

        if(loc1 === -1 || loc2 === -1) return null;

        let seconds = Number(data.substr(loc1 + 18, loc2 - (loc1 + 18)));

        return !isNaN(seconds) ? seconds : null;
    }
    catch(err)
    {
        return null;
    }
}

/**
 * Get video id and length
 * @param {String} url - youtube video watch URL
 * @returns {Promise} resolves with an object containing id and length in seconds
 */
function get_info(url)
{
    return new Promise((resolve, reject) =>
    {
        let id = get_id(url);
        if(!id)
        {
            let err = new Error('Invalid URL');
            err.code = 'INVALID_URL';
            return reject(err);
        }

        download('https://www.youtube.com/watch?v=' + id)
        .then((page) => parse_length(page))
        .then((len) =>
        {
            if(len) return resolve({ id : id, length : len });
            else
            {
                let err = new Error(`Couldn't extract length from downloaded`);
                err.code = 'PARSE_ERROR';
                return reject(err);
            }
        })
        .catch((err) => reject(err));
    });
}

module.exports = get_info;