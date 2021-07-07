const express = require('express')
const router = express.Router()
const shortid = require('shortid')
const { isUrl } = require('../utils/validateUrl')
const Url = require('../models/Url')
const User = require('../models/User')

router.post('/shorten/', async (req, res) => {
    const { originUrl, id } = req.body
    const base = process.env.BASE_URL

    const urlId = shortid.generate()
    if (isUrl(originUrl)) {
        try {
            let url = await Url.findOne({ originUrl })
            if (url) {
                res.json(url)
            } else {
                const ipAddress = req.ip;
                const shortUrl = `${base}/api/url/${urlId}`
                url = new Url({
                    user: id,
                    originUrl,
                    shortUrl,
                    urlId,
                    date: new Date(),
                    createdByIp: ipAddress,

                })
                await url.save()
                res.json(url)
            }
        } catch (e) {
            console.log(e.message)
            res.status(500).json('Server error')
        }
    } else {
        res.status(400).json('Invalid Url')
    }
})
router.get('/:urlId', async (req, res) => {
    try {
        const url = await Url.findOne({ urlId: req.params.urlId });
        const clickedByUser = url.user
        const user = await User.findOne({ _id: clickedByUser })
        if (user) {
            if (!user.linksVisited.includes(url.shortUrl)) {
                user.linksVisited.push(url.shortUrl)
                await user.save()
            }
        }
        if (url) {
            if (url.clickedByUsers.includes(clickedByUser)) {
                url.clicks++
                await url.save()
                return res.redirect(url.originUrl);
            }
            url.clickedByUsers.push(clickedByUser)
            url.clicks++;
            url.uniqueClick++
            await url.save();
            return res.redirect(url.originUrl);
        } else res.status(404).json('Not found');
    } catch (err) {
        console.log(err);
        res.status(500).json('Server Error');
    }
});

module.exports = router