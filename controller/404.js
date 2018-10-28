let router = require('express').Router();

router.all('*', (req, res) =>
{
    res.status(404).send('404 NOT FOUND');
});

module.exports = router;