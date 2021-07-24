const express = require('express');
const router = new express.Router();
const path = require('path');

router.get('', (req, res, next) => {
    res.sendFile('index.html');
});

router.get('*', (req, res, next) => {
    res.sendFile(path.resolve(__dirname + '/../public/400.html'));
})

module.exports = router;
