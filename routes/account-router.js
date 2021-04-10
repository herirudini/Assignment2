const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account-controller.js');
const auth = require("../middlewares/authJwt");
const errorHandler = require('../middlewares/errorHandler.js')


router.post('/signup', auth.uniqueData, accountController.signup);
router.put('/login', accountController.login);
router.use(auth.authentication);
router.patch('/logout', accountController.logout);

router.use(errorHandler)
module.exports = router;
