const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account-controller.js');
const userController = require('../controllers/user-controller.js');
const auth = require('../middlewares/authJwt');
const errorHandler = require('../middlewares/errorHandler.js')

router.use(auth.authentication);
router.get('/user/home', userController.myDetails);
router.patch('/user/change-username', auth.uniqueData, userController.changeUsername)
router.put('/user/change-email', auth.twoStepAuth, auth.uniqueData, userController.changeEmail, accountController.logout);
router.put('/user/change-password', auth.twoStepAuth, userController.changePassword, accountController.logout);
router.delete('/user/delete-account', auth.twoStepAuth, userController.deleteMyAccount, accountController.logout);

router.use(errorHandler)

//FOTER//

module.exports = router;
