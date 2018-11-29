let video_duration = require('../.../../../../controller/function/video_duration.js');
let is_valid = video_duration.is_valid;
let faker = require('faker');
let assert = require('assert');

describe('video duration functions test', () =>
{
    it('should check if input url is valid', () =>
    {
        assert
        (is_valid
            (`https://www.youtube.com/watch?v=${faker.random.alphaNumeric(11)}`));

        assert
        (is_valid('https://www.youtube.com/watch?v=ucZl6vQ_8Uo'));

        assert
        (is_valid('https://youtu.be/ucZl6vQ_8Uo?t=48'));

        assert
        (is_valid
            ('https://www.youtube.com/watch?v=ucZl6vQ_8Uo&feature=youtu.be&t=48'));

        assert
        (is_valid
            ('https://www.youtube.com/watch?feature=youtu.be&v=ucZl6vQ_8Uo&t=48'));

        assert
        (is_valid
            ('https://www.youtube.com/watch?feature=youtu.be&v=ucZl6vQ_8Uo'));

        assert(is_valid('https://www.youtube.com/watch?feature=youtu.be') === false);
        assert(is_valid('https://www.youtube.com/watch?v=ucZlUo') === false);
        assert(is_valid('https://www.youtube.com') === false);
        assert(is_valid('http://www.youtube.com/watch?v=ucZl6vQ_8Uo') === false);
    });
});