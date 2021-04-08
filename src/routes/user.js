const express = require('express');
const router = new express.Router();
const multer = require('multer');
const sharp = require('sharp');

const auth = require('../middleware/middleware');
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account');

const User = require('../models/user');
const checkIfFieldsValid = require('../utils/shared');

// Multer config
const upload = multer({
    limits: {
        // 1.5 Mb
        fileSize: 1500000
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
            callback(new Error('File must be an image.'));
        }
        callback(undefined, true);
    }
});

// POST signUp user
router.post('', async (req, res, next) => {
    const user = new User(req.body);
    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
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
});

// POST user profile image
router.post('/profile/image', auth, upload.single('profileImage'), async (req, res, next) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.profileImage = buffer;
    await req.user.save();
    res.status(200).json({
        message: 'File uploaded successfully'
    });
}, (error, req, res, next) => {
    res.status(400).json({
        message: `User image upload failed. ${error}`
    })
});

// GET user profile image
router.get('/:id/image', async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.profileImage) {
            res.status(404).json({
                message: `A problem occurred when getting the user's profile image.`
            });
        }
        res.set('Content-Type', 'image/png');
        res.send(user.profileImage)
    } catch (err) {
        res.status(404).json({
            message: `Profile image not found. ${err}`
        })
    }
});

// DELETE user profile image
router.delete('/profile/image', auth, async (req, res, next) => {
    req.user.profileImage = undefined;
    await req.user.save()
    res.status(200).json({
        message: 'Profile image deleted.'
    })
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
        sendCancellationEmail(req.user.email, req.user.name);
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
