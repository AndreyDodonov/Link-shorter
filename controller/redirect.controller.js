const errorHandler = require('../utils/errorHandler');
const Link = require('../Models/Link');

module.exports.redir = async (req, res) => {
    try {
        const link = await Link.findOne({ code: req.params.code});
        if (link) {
            link.clicks++;
            await link.save();
            return res.redirect(link.from)

        } else {
            res.status(404).json('link not found');
        }
    } catch (e) {
        errorHandler(res, e);

    }
};
