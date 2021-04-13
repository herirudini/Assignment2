const express = require('express');
const router = express.Router();
const marketController = require('../controllers/market-controller.js');
const auth = require("../middlewares/authJwt");
const errorHandler = require ("../middlewares/errorHandler");

router.use(auth.authentication)
router.post('/markets', marketController.createMarket);
router.get('/markets', marketController.listMyMarkets);
router.put('/markets/:market_id', auth.marketAuthor, marketController.collectMarketById);
router.patch('/markets/:market_id', auth.marketAuthor, marketController.editMarketById);
router.delete('/markets/:market_id', auth.marketAuthor, marketController.deleteMarketById);

router.use(errorHandler)

module.exports = router;
