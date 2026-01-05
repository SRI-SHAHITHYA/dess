import express from 'express';
import * as topicsController from '../controllers/topicsController.js';

const router = express.Router();

router.get('/:submoduleId', topicsController.getTopics);
router.get('/module/:moduleId', topicsController.getTopicsByModule); // For standalone categories
router.post('/', topicsController.createTopic);
router.put('/:id', topicsController.updateTopic);
router.delete('/:id', topicsController.deleteTopic);

export default router;
