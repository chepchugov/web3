const express = require('express');
const {ensureNotLoggedIn} = require('connect-ensure-login');
const passport = require('passport');

const {User} = require('../database');

const router = express.Router();
router.get('/login', ensureNotLoggedIn('/'), (req, res) => {
    res.render('login', {title: 'Log in'});
});
router.post('/login', ensureNotLoggedIn('/'), async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    // Catch errors authenticating directly
    const {error} = await User.authenticate()(username, password);
    if (error) {
        if (error.name === 'IncorrectUsernameError') {
            return res.json({success: false, reason: 'IncorrectCredentials'});
        }
        if (error.name === 'IncorrectPasswordError') {
            return res.json({success: false, reason: 'IncorrectCredentials'});
        }
        return next(error);
    }
    // No errors, authenticate again using passport
    passport.authenticate('local')(req, res, () => {
        res.json({success: true});
    });
});

module.exports = router;
