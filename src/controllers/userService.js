const User = require('../models/User')
const RefreshToken = require('../models/RefreshToken')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const bcrypt = require('bcrypt')

function randomTokenString() {
    return crypto.randomBytes(40).toString('hex')
}
function generateJwtToken(user) {
    // create a jwt token containing the account id that expires in 15 minutes
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
}
function generateRefreshToken(user, ipAddress) {
    // create a refresh token that expires in 7 days
    return new RefreshToken({
        user: user.id,
        token: randomTokenString(),
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdByIp: ipAddress
    });
}

async function signup(params) {
    const inputs = Object.keys(params)
    const allowedInputs = [
        'firstName',
        'lastName',
        'email',
        'password',
    ]
    const isValidOperation = inputs.every(input => allowedInputs.includes(input))
    if (!isValidOperation) throw new Error('Not valid operation')
    const isRegistered = await User.findOne({ email: params.email })
    if (isRegistered) throw new Error('Email already registered');
    params.passwordHash = await bcrypt.hashSync(params.password, 8)
    const user = new User(params)
    await user.save()
}

async function signin({ email, password, ipAddress }) {
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        throw 'Please provide correct credentials';
    }

    // authentication successful so generate jwt and refresh tokens
    const jwtToken = generateJwtToken(user);
    const refreshToken = generateRefreshToken(user, ipAddress);

    // save refresh token
    await refreshToken.save();

    // return basic details and tokens
    return {
        ...basicDetails(user),
        jwtToken,
        refreshToken: refreshToken.token
    };
}
async function refreshToken({ token, ipAddress }) {
    const refreshToken = await getRefreshToken(token);
    const { user } = refreshToken;
    // replace old refresh token with a new one and save
    const newRefreshToken = generateRefreshToken(user, ipAddress);
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replacedByToken = newRefreshToken.token;
    await refreshToken.save();
    await newRefreshToken.save();

    // generate new jwt
    const jwtToken = generateJwtToken(user);

    // return basic details and tokens
    return {
        ...basicDetails(user),
        jwtToken,
        refreshToken: newRefreshToken.token
    };
}
function basicDetails(user) {
    const { id, firstName, lastName, email, created } = user;
    return { id, firstName, lastName, email, created };
}
module.exports = {
    signup,
    signin,
    refreshToken,
}