const {Router} = require('express');
const router = Router();
const controller = require('../controller/auth.controller');


/* /api/auth */

router.post('/register', controller.validate('register'), controller.register);
router.post('/login', controller.validate('login'), controller.login);

module.exports = router;
