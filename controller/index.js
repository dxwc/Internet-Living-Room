const express = require('express');
const router = express.Router();


router.use('/auth', require('./auth'));
router.use('/', require('./home'));
router.use('/channel', require('./channel'));

module.exports = router;
