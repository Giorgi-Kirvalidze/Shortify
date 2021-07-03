const userService = require('../controllers/userService')

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