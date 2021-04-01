const express = require('express');
const router = new express.Router();

const User = require('../models/user');
const checkIfFieldsValid = require('../utils/shared');

router.post('', async (req, res, next) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.status(201).json({
            message: 'New user created.'
        });
    } catch (err) {
        res.status(400).json({
            err,
            message: err.message
        })
    }
});

router.get('', async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({
            users: users
        })
    } catch (err) {
        res.status(401).json({
            message: err.message
        })
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            return res.status(200).json({
                user
            })
        }
        res.status(404).json({
            message: 'No user was found for that id.'
        })
    } catch (err) {
        res.status(401).json({
            message: err.message
        })
    }
});

router.patch('/:id', async (req, res, next) => {
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const reqUpdateFields = Object.keys(req.body);

    checkIfFieldsValid(reqUpdateFields, allowedUpdates, res);

    try {
        const newUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!newUser) {
            return res.status(404).json({
                message: 'No user was found with that id!'
            })
        }
        res.status(201).json({
            newUser
        })
    } catch ({message}) {
        res.status(400).json({
            message
        })
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({
                message: 'No user was found with that id!'
            })
        }
        res.status(201).json({
            deletedUser,
            message: 'User deleted successfully.'
        })

    } catch ({message}) {
        res.status(400).json({
            message
        })
    }
});

module.exports = router;
