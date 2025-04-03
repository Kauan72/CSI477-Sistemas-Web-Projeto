const express = require("express");
const router = express.Router();
const CompromissoController = require("../controller/CompromissoController");

router.post('/', CompromissoController.createCompromisso);
router.get('/', CompromissoController.getCompromissosByDate);
router.get('/:id', CompromissoController.getCompromissosById);
router.put('/:id', CompromissoController.updateCompromisso);
router.delete('/:id', CompromissoController.deleteCompromisso);

module.exports = router