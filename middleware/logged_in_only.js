module.exports = (req, res, next) =>
{
    if(req.user) return next();
    else return res.status(401).json
    ({
        success : false,
        reason_code : -88,
        reason_text : 'You must be logged in to use this feature'
    });
}