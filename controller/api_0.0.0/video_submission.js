let router = require('express').Router;
let op          = require('../../model/api_operations');

router.post('/api/0.0.0/submit_video', (req, res) => {
    // verify all the data come thru
    // need to have the url, by, and channel
    // if valid: use the op to create a new enrty.
});