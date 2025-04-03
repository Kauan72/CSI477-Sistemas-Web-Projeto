const express = require('express');
const router = express.Router();
const ClassificacaoController = require('../controller/ClassificacaoController')

// Rota para buscar vídeos por tag
router.get('/:tag/videos', ClassificacaoController.buscarVideosPorTag);
router.get('/', ClassificacaoController.getTags);
router.get('/aleatorio/:tag', ClassificacaoController.buscarVideoAleatorioPorTag);
router.post('/', ClassificacaoController.createTag);
router.delete('/:id', ClassificacaoController.deleteTag);

module.exports = router;