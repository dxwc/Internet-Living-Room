let router = require('express').Router();

router.use(require('./home.js'));
router.use(require('./api_0.0.0/channel.js'));
router.use(require('./api_0.0.0/main_channel.js'));
router.use(require('./api_0.0.0/main_channel_chat.js'));
router.use(require('./api_0.0.0/user.js'));
router.use(require('./api_0.0.0/auth.js'));
router.use(require('./api_0.0.0/login.js'));
router.use(require('./api_0.0.0/logout.js'));
router.use(require('./404.js'));

module.exports = router;