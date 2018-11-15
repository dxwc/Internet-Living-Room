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
  }).then((user) => {
    res.json({ msg: "channel created" });
  }).catch(() => {
    res.status(400).json({ msg: "error creating channel" });
  });
});

router.get('/get-channel', (req, res) => {
	res.json({msg: "get channel"});
});


module.exports = router;
