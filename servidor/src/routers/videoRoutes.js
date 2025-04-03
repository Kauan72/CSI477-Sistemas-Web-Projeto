const express = require('express');
const router = express.Router();
const VideoController = require('../controller/VideoController');

router.post('/', VideoController.createVideo);
router.get('/:id', VideoController.getVideo);
router.get('/', VideoController.getVideos);
router.post('/:id/tags', VideoController.adicionarTags);
router.put('/:id', VideoController.updateVideo)
router.delete('/:id', VideoController.deleteVideo)

module.exports = router;