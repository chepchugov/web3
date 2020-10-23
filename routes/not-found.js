const express = require('express');

const router = express.Router();
router.get('/not-found', (req, res) => {
    res.render('not-found', {title: 'Not found'});
});

module.exports = router;
