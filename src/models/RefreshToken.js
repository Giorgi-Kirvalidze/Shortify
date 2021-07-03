const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    token: String,
    expires: Date,
    createdAt: { type: Date, default: Date.now() },
    revokedByIp: String,
    revoked: Date,
    replacedByToken: String,
    createdByIp: String
})

schema.virtual('isExpired').get(function () {
    return Date.now() >= this.expires
})
schema.virtual('isActive').get(function () {
    return !this.isExpired && !this.revoked
})

module.exports = mongoose.model('RefreshToken', schema)