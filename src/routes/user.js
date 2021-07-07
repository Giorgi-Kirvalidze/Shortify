const express = require('express');
const router = express.Router();
const {
    signin,
    signup,
    refreshToken,
    getUrlsByUser
} = require('../controllers/userController');

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/urls/:id', getUrlsByUser);

router.post('/refresh-token', refreshToken);


module.exports = router
