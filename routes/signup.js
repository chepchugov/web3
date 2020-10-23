const express = require('express');
const {ensureNotLoggedIn} = require('connect-ensure-login');
const passport = require('passport');

const {User} = require('../database');

const router = express.Router();
router.get('/signup', ensureNotLoggedIn('/'), (req, res) => {
    res.render('signup', {title: 'Sign up'});
});
router.post('/signup', ensureNotLoggedIn('/'), async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!User.testUsername(username)) {
        return res.json({success: false, reason: 'MismatchingUsername'});
    }
    if (!User.testPassword(password)) {
        return res.json({success: false, reason: 'MismatchingPassword'});
    }
    try {
        await User.register({username: username, isAdmin: false}, password);
        passport.authenticate('local')(req, res, () => {
            res.json({success: true});
        });
    } catch (err) {
        if (err.name === 'UserExistsError') {
            return res.json({success: false, reason: 'UserExists'});
        }
        return next(err);
    }
});

module.exports = router;
