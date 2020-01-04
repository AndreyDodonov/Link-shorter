const {Router} = require('express');
const router = Router();
const controller = require('../controller/redirect.controller');

router.get('/:code', controller.redir);

module.exports = router;
