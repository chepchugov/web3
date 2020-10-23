const express = require('express');
const {ensureLoggedIn} = require('connect-ensure-login');
const {User} = require('../database');

const router = express.Router();
router.get('/tasks', ensureLoggedIn('/'), (req, res) => {
    res.render('tasks', {title: 'Tasks'});
});
router.post('/tasks', ensureLoggedIn('/'), (req, res) => {
    const title = req.body.title;
    if (title.length === 0) {
        return res.json({success: false, reason: 'EmptyTitle'});
    }
    const user = req.user;
    const task = user.tasks.create({title: title, description: req.body.description});
    user.tasks.push(task);
    user.save();
    return res.json({success: true, task: task});
});
router.get('/tasks/:id', ensureLoggedIn('/'), (req, res) => {
    const task = req.user.tasks.id(req.params.id);
    return res.render('task', {title: 'Task', task: task.toObject()})
});
router.patch('/tasks/:id', ensureLoggedIn('/'), (req, res) => {
    const user = req.user;
    const task = user.tasks.id(req.params.id);
    task.isDone = req.body.isDone;
    user.save();
    return res.json({success: true, task: task});
});
router.put('/tasks/:id', ensureLoggedIn('/'), (req, res) => {
    const id = req.params.id;
    const message = req.body.commentMessage;
    if (message.length === 0) {
        return res.json({success: false, reason: 'EmptyText'});
    }
    const user = req.user;
    const task = user.tasks.id(id);
    const comment = task.comments.create({message: message});
    task.comments.push(comment);
    user.save();
    return res.json({success: true, comment: comment});
});
router.delete('/tasks/:id', ensureLoggedIn('/'), async (req, res) => {
    /* TODO */
    await User.updateOne({_id: req.user._id}, {
        $pull: {
            tasks: {_id: req.params.id}
        }
    });
    return res.json({success: true});
});

/* загрузка комментариев */
router.get('/list_comments/:id', ensureLoggedIn('/'), async (req, res) => {
    const id = req.params.id;
    const user = req.user;
    const task = user.tasks.id(id);
    const comments = task.comments;

    console.log(comments);

    return res.json({success: true, comments: comments.toObject()});
});

module.exports = router;
