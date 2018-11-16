const express = require('express');
const router = express.Router();


router.use('/', require('./auth'));
router.use('/', require('./home'));
router.use('/', require('./channel'));

module.exports = router;
