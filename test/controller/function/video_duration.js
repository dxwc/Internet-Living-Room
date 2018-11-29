/*

// Currently pausing writing tests to finish up the project
// Add module.exports in the actual file to use this

let video_duration = require('../.../../../../controller/function/video_duration.js');
let get_id = video_duration.get_id;
let faker = require('faker');
let assert = require('assert');

describe('video duration functions test', () =>
{
    it('should check if input url is valid', () =>
    {
        let id_len = 11;
        assert
        (
            get_id
            (`https://www.youtube.com/watch?v=${faker.random.alphaNumeric(11)}`)
            .length === id_len
        );

        assert
        (get_id('https://www.youtube.com/watch?v=ucZl6vQ_8Uo').length === id_len);

        assert
        (get_id('https://youtu.be/ucZl6vQ_8Uo?t=48').length === id_len);

        assert
        (
            get_id
            ('https://www.youtube.com/watch?v=ucZl6vQ_8Uo&feature=youtu.be&t=48')
            .length === id_len
        );

        assert
        (
            get_id
            ('https://www.youtube.com/watch?feature=youtu.be&v=ucZl6vQ_8Uo&t=48')
            .length === id_len
        );

        assert
        (
            get_id
            ('https://www.youtube.com/watch?feature=youtu.be&v=ucZl6vQ_8Uo')
            .length === id_len
        );

        assert(get_id('https://www.youtube.com/watch?feature=youtu.be') === null);
        assert(get_id('https://www.youtube.com/watch?v=ucZlUo') === null);
        assert(get_id('https://www.youtube.com') === null);
        assert(get_id('http://www.youtube.com/watch?v=ucZl6vQ_8Uo') === null);
        assert(get_id() === null);
        assert(get_id('') === null);
        assert(get_id({}) === null);
        assert(get_id('https://example.com') === null);
    });
});

*/