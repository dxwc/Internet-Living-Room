let router = require('express').Router();
let op     = require('../model/api_operations');

router.post
('/vote', require('../middleware/logged_in_only.js'), (req, res) =>{
	if( typeof(req.body.username) === 'string' &&
		typeof(req.body.channel_id) === 'string' &&
		typeof(req.body.video_id) === 'string' && 
		typeof(req.body.vote) === 'number')
	{

		op.validate_vote(req.body.username, req.body.channel_id, req.body.video_id, req.body.vote)
		.then((result) =>{

			console.log(result);
			return res.status(201).json({msg: "vote", success: true});
		})
		.catch((err) => {
			if(err.code === "Already_Voted"){
				let out = {
					success: false,
					reason_code: -1,
					reason_text: 'already voted for this video',
				}
				return res.status(201).json(out);
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
}
);

router.get('/vote/:username/:channel_id/:video_id', (req, res) => {

	//console.log(typeof(parseInt(req.params.vote_id)));


		op.get_user_vote(req.params.username, req.params.channel_id, req.params.video_id)
		.then((result) => {
			result.success = true;
			return res.status(201).json(result);

		}).catch((err) => {
			throw err;
		})



	});

module.exports = router;