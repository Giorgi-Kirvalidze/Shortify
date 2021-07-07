const userService = require('../controllers/userService')
const Url = require('../models/Url')
const User = require('../models/User')
exports.signup = (req, res, next) => {
    userService.signup(req.body)
        .then(() => res.status(201).json({ message: 'Registration successful' }))
        .catch(next);
}

exports.signin = (req, res, next) => {
    const { email, password } = req.body;
    const ipAddress = req.ip;
    userService.signin({ email, password, ipAddress })
        .then(({ refreshToken, ...user }) => {
            setTokenCookie(res, refreshToken);
            res.json(user);
        })
        .catch(next);
}
exports.getUrlsByUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.params.id })
        if (user) {
            res.status(200).json({ linksVisited: user.linksVisited })
        }
    } catch (e) {
        res.status(500).json({ message: e.message })
    }

}
function setTokenCookie(res, token) {
    // create cookie with refresh token that expires in 7 days
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
    return res.cookie('refreshToken', token, cookieOptions);
}

exports.refreshToken = (req, res, next) => {
    const token = req.cookies.refreshToken;
    const ipAddress = req.ip;
    userService.refreshToken({ token, ipAddress })
        .then(({ refreshToken, ...user }) => {
            setTokenCookie(res, refreshToken);
            res.json(user);
        })
        .catch(next);
}