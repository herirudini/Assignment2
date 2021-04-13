const express = require('express');
const router = express.Router();
const barrackController = require('../controllers/barrack-controller.js');
const auth = require("../middlewares/authJwt.js");
const terms = require("../middlewares/terms.js");
const errorHandler = require ("../middlewares/errorHandler");
//
router.use(auth.authentication)
router.post('/barracks', terms.limitBarrack, barrackController.createBarrack);
router.get('/barracks', barrackController.listMyBarracks);
router.put('/barracks/:barrack_id', auth.barrackAuthor, barrackController.collectBarrackById);
router.patch('/barracks/:barrack_id', auth.barrackAuthor, barrackController.editBarrackById);
router.delete('/barracks/:barrack_id', auth.barrackAuthor, barrackController.deleteBarrackById);
//
router.use(errorHandler)
//
module.exports = router;
