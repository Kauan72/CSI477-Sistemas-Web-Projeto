const express = require("express");
const router = express.Router();
const CompromissoController = require("../controller/CompromissoController");

router.post('/compromissos', CompromissoController.createCompromisso);
router.get('/compromissos', CompromissoController.getCompromissos);
router.get('/compromissos/:id', CompromissoController.getCompromissosById);
router.put('/compromissos/:id', CompromissoController.updateCompromisso);
router.delete('/compromissos/:id', CompromissoController.deleteCompromisso);

module.exports = router