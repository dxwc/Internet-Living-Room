/**
 * Checks if user is logged in, if logged in, returns username, if not returns false
 * @param req - Request object from controller
 */
function if_logged_in_get_user_name(req)
{
    if
    (
        req.user &&
        req.session &&
        req.session.passport &&
        req.session.passport.user &&
        typeof(req.session.passport.user.uname) === 'string' &&
        req.session.passport.user.uname.length
    )
    {
        return req.session.passport.user.uname;
    }
    else
    {
        return false;
    }
}

module.exports = if_logged_in_get_user_name;