let router = require('express').Router();
let op     = require('../model/api_operations');

router.post
('/vote', require('../middleware/logged_in_only.js'), 
	(req, res) =>{
	if( typeof(req.body.channel_id) === 'string' &&
		typeof(req.body.video_id) === 'string' && 
		typeof(req.body.vote) === 'number')
	{

		op.validate_vote(req.session.passport.user.id, req.body.channel_id, req.body.video_id, req.body.vote)
		.then((result) =>{
			return res.status(201).json({msg: "vote", success: true});
		})
		.catch((err) => {
			if(err.code === "Already_Voted"){
				let out = {
					success: false,
					reason_code: -1,
					reason_text: 'already voted for this video',
				}
				return res.status(400).json(out);
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

router.get('/user_vote/:user_id/:channel_id/:video_id/', (req, res) => {

	//console.log(typeof(parseInt(req.params.vote_id)));
	//req.session.passport.user.id
		op.get_user_vote(req.params.user_id, req.params.channel_id, req.params.video_id)
		.then((result) => {
			return res.status(200).json({success: true, vote: result});

		}).catch((err) => {
			throw err;
		})



	});

router.get('/total_vote/:channel_id/:video_id', (req, res) =>{
	op.get_total_vote(req.params.channel_id, req.params.video_id)
	.then((result) => {
		return res.status(200).json({success: true, vote: result});
	}).catch((err) =>{
		throw err;
	})
});

router.get('/highest_vote/:channel_id', (req, res) =>{
	op.highest_vote(req.params.channel_id)
	.then((video) =>{
		return res.status(200).json({success: true, video_id: video[0], vote: video[1]});
	})
	.catch((err) => {
		console.log(typeof(err));
		throw err;
	})
});

module.exports = router;