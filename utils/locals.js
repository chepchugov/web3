const {User} = require('../database');

module.exports = () => {
    return (req, res, next) => {
        if (req.user) {
            res.locals.user = req.user.toObject();
        }
        res.locals.url = req.originalUrl;
        res.locals.usernamePattern = User.usernamePattern.source;
        res.locals.passwordPattern = User.passwordPattern.source;
        res.locals.usernameMaxLength = User.usernameMaxLength;
        res.locals.passwordMaxLength = User.passwordMaxLength;
        next();
    };
};