const express = require('express');
const model = require('../model');
const passport = require('../middleware/auth');

const router = express.Router();
const User = model.User;

router.get('/error', (req, res) => {
  res.sendStatus(401);
})


router.post('/signup', (req,res) => {
  User.create({
    uname: req.body.uname,
    upass: req.body.upass,
    fname: req.body.fname,
    lname: req.body.lname,
  }).then((user) => {
    res.json({ msg: "user created" });
  }).catch(() => {
    res.status(400).json({ msg: "error creating user" });
  });
});


router.post('/login',
  passport.authenticate('local', { failureRedirect: '/auth/error' }),
  (req, res) => {
    res.json({
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
    });
  });


router.get('/logout', (req, res) => {
  req.logout();
  res.sendStatus(200);
});


router.get('/profile',
  passport.redirectIfNotLoggedIn('/auth/error'),
  (req, res) => {
    res.json({ msg: "This is the profile page for: "+req.user.email });
});


module.exports = router;