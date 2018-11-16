const express = require('express');
const model = require("../model");
const router = express.Router();
const Channel = model.Channel;

router.get('/error', (req, res) => {
  res.sendStatus(401);
})

router.post('/new-channel', (req,res) => {
  Channel.create({
    host: req.body.host,
  }).then((channel) => {
    res.json({ msg: "channel created" });
  }).catch((err) => {
  	console.log(err);
    res.status(400).json({ msg: "error creating channel" });
  });
});

//get channels
router.get('/channels', (req, res) => {
	res.json({msg: "get channel"});
});


module.exports = router;
