const errorHandler = require('../utils/errorHandler');
const Link = require('../Models/Link');
const config = require('config');
const shortid = require('shortid');

module.exports.getAll = async (req, res) => {
    try {
        const links = await Link.find({owner: req.user.userId});
        await res.json(links);
    } catch (e) {
        errorHandler(res, e);
    }
};

module.exports.post = async (req, res) => {
    try {
        const baseUrl = "https://linkshorter1.herokuapp.com";  // config.get('baseUrl'); TODO: <-- check config
        const {from} = req.body;
        const code = shortid.generate();

        const existing = await Link.findOne({from});
        if (existing) {
            return res.json({link: existing});
        }

        const to = baseUrl + '/t/' + code;

        const link = new Link({
            code, to, from, owner: req.user.userId
        });

        await link.save();
        res.status(201).json({link});
    } catch (e) {
        errorHandler(res, e);
    }
};

module.exports.getById = async (req, res) => {
    try {
        const link = await Link.findById(req.params.id);
        await res.json(link);
    } catch (e) {
        errorHandler(res, e);
    }
};
