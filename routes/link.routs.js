const {Router} = require('express');
const router = Router();
const Link = require('../Models/Link');
const controller = require('../controller/link.controller');
const auth = require('../middleware/auth.middleware');

router.post('/generate', auth, controller.post);
router.get('/', auth, controller.getAll);
router.get('/:id', auth, controller.getById);

module.exports = router;

