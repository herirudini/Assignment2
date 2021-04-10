const express = require('express');
const router = express.Router();
const invadeController = require('../controllers/invade-controller.js');
const auth = require("../middlewares/authJwt.js");
const terms = require("../middlewares/terms.js");
const errorHandler = require ("../middlewares/errorHandler");

// router.get('/invade', invadeController.listTarget); ANEH TAPI NYATA
router.use(auth.authentication);
router.get('/invade', invadeController.listTarget);
router.get('/invade/:username', invadeController.checkTargetByUsername);
router.put('/invade/:username/attack', terms.invadeTerms, invadeController.attackTargetByUsername);

router.use(errorHandler)
module.exports = router;
