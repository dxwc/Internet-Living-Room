const express = require('express');
const model = require("../model");
const router = express.Router();
const Channel = model.Channel;

router.use((req,res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

router.get('/error', (req, res) => {
  res.sendStatus(401);
});

router.post('/new-channel', (req,res) => {
  Channel.create({
    host: req.body.host,
    description: req.body.description,
  }).then((channel) => {
    res.json({ msg: "channel created" });
  }).catch((err) => {
  	console.log(err);
    res.status(400).json({ msg: "error creating channel" });
  });
});

//get channels
router.get('/channels', (req, res) => {
	Channel.findAll().then((channel) => {
    res.status(200).json({channel});
  })
});


module.exports = router;
