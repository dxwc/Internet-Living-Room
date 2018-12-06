let router = require('express').Router();
let op     = require('../../model/api_operations');

router.post('/api/0.0.0/createvote', (req, res) => {
	//assume user, channel_id, and video_id as they actually exist in database
	if( typeof(req.body.username) === 'string' &&
		typeof(req.body.channel_id) === 'string' &&
		typeof(req.body.video_id) === 'string'
		)
	{
		op.create_user_vote(req.body.username, req.body.channel_id, 
			req.body.video_id)
		.then((result) => {
			result.success = true;
			return res.status(200).json(result);
		}).catch((err) => {
			throw err;
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

router.post
('/api/0.0.0/vote', (req, res) =>{
	console.log(typeof(req.body.vote_id));
	if( typeof(req.body.vote_id) === 'number' && 
		typeof(req.body.vote) === 'number')
	{
		op.validate_vote(req.body.vote_id, req.body.vote)
		.then((result) =>{

			return res.status(200).json({msg: "vote", success: true});
		})
		.catch((err) => {
			if(err.code === "Already_Voted"){
				let out = {
					success: false,
					reason_code: -1,
					reason_text: 'already voted for this video',
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
}
);

router.get('/api/0.0.0/vote/:vote_id', (req, res) => {

	//console.log(typeof(parseInt(req.params.vote_id)));
	let vote_id = parseInt(req.params.vote_id);


		op.get_user_vote(vote_id)
		.then((result) => {
			result.success = true;
			return res.status(200).json(result);

		}).catch((err) => {
			throw err;
		})



	});

module.exports = router;