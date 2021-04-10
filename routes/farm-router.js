const express = require('express');
const router = express.Router();
const farmController = require('../controllers/farm-controller.js');
const auth = require("../middlewares/authJwt");
const errorHandler = require ("../middlewares/errorHandler");
//
router.use(auth.authentication)
router.post('/farms', farmController.createFarm);
router.get('/farms', farmController.listMyFarms);
router.put('/farms/:farm_id', auth.farmAuthor, farmController.collectFarmById);
router.patch('/farms/:farm_id', auth.farmAuthor, farmController.editFarmById);
router.delete('/farms/:farm_id', auth.farmAuthor, farmController.deleteFarmById);

router.use(errorHandler)
//
module.exports = router;
