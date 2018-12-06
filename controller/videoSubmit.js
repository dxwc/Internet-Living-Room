const router = require('express').Router();
const op     = require('../model/api_operations');
const uuidParse = require('uuid-parse');

router.post('/submit-video', (req, res) =>{

	const channel_uuid = uuidParse.parse(req.body.channel_id);
	//console.log(typeof(video_uuid));
	if(typeof(req.body.video_id) === 'string' &&
		typeof(channel_uuid) === 'object' &&
		typeof(req.body.length) === 'number' &&
		typeof(req.body.username) === 'string'){

		op.submit_video(req.body.video_id, req.body.channel_id, req.body.length, req.body.username)
		.then((result) => {
			return res.status(200).json({msg: "submited", success: true});
		}).catch((err) => {
			if(err.code === "Already_Existed"){
				let out = {
					success: false,
					reason_code: -1,
					reason_text: 'already submited this video',
				}
				return res.status(200).json(out);
			} else {
				return res.status(500).json
	                ({
	                    success : false,
	                    reason_code : -3,
	                    reason_text : 'Unhandled error, contact admin@example.com'
	                });
		}
	});

	} else {
		return res.status(400).json
        ({
            success : false,
            reason_code : -2,
            reason_text : 'Invalid request, type error'
        });
	}
});

module.exports = router;