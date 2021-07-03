const express = require('express');
const router = express.Router();
const {
    signin,
    signup,
    refreshToken
} = require('../controllers/userController');

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/refresh-token', refreshToken);


module.exports = router
