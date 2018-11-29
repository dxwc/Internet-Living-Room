function is_valid(url)
{
    try
    {
        return typeof(url) === 'string' && url.length > 0 &&
        (
            url.match(/https:\/\/www.youtube.com\/watch\?.*\&?v=.{11}.*/) !== null ||
            url.match(/https:\/\/youtu.be\/...........\??.*/)             !== null
        );
    }
    catch(err)
    {
        console.error(err);
        return false;
    }
}

module.exports.is_valid = is_valid;