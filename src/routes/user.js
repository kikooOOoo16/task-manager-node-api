const express = require('express');
const router = new express.Router();
const auth = require('../middleware/middleware');

const User = require('../models/user');
const checkIfFieldsValid = require('../utils/shared');

// POST signUp user
router.post('', async (req, res, next) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).json({
            message: 'New user created.',
            user,
            token
        });
    } catch ({message}) {
        res.status(400).json({
            message
        });
    }
});

// POST login user
router.post('/login', async (req, res, next) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).json({
            user,
            token
        });
    } catch ({message}) {
        res.status(400).json({
            message
        });
    }
});

// POST logout user
router.post('/logout', auth, async (req, res, next) => {
    try {
        req.user.tokens = req.user.tokens.filter(
            (token) => token.token !== req.token
        );
        await req.user.save();
        res.status(200).json({
            message: 'User logged out!'
        })
    } catch (err) {
        res.status(500).json({
            message: 'User logout failed!'
        });
    }
});

// POST logout user from all sessions
router.post('/logoutall', auth, async (req, res, next) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).json({
            message: 'User logged out from all sessions!'
        });
    } catch (err) {
        res.status(500).json({
            message: 'User logout failed!'
        });
    }
})

// GET user data
router.get('/profile', auth, async (req, res, next) => {
    try {
        res.status(200).json({
            user: req.user
        });
    } catch (err) {
        res.status(401).json({
            message: err.message
        });
    }
});

// PATCH single user
router.patch('/profile', auth, async (req, res, next) => {
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const reqUpdateFields = Object.keys(req.body);


    try {
        // const newUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        await checkIfFieldsValid(reqUpdateFields, allowedUpdates, res);
        reqUpdateFields.forEach(updateField => req.user[updateField] = req.body[updateField]);
        await req.user.save();

        res.status(201).json({
            user: req.user
        });
    } catch ({message}) {
        res.status(400).json({
            message
        });
    }
});

// DELETE single user
router.delete('/profile', auth, async (req, res, next) => {
    try {
        await req.user.remove();
        res.status(201).json({
            user: req.user,
            message: 'User deleted successfully.'
        });

    } catch ({message}) {
        res.status(400).json({
            message
        });
    }
});

module.exports = router;
