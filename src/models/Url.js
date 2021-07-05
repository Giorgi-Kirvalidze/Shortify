const mongoose = require('mongoose');
const Schema = mongoose.Schema

const schema = new Schema({
    urlId: {
        type: String,
        required: true,
    },
    originUrl: {
        type: String,
        required: true,
    },
    shortUrl: {
        type: String,
        required: true,
    },
    clicks: {
        type: Number,
        required: true,
        default: 0,
    },
    uniqueClick: {
        type: Number,
        required: true,
        default: 0
    },
    clickedByUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],

    createdByIp: { type: String },

    date: {
        type: String,
        default: Date.now,
    },
});

module.exports = mongoose.model('Url', schema);