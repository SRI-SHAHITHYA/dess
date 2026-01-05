import express from 'express';
import * as modulesController from '../controllers/modulesController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:categoryId', modulesController.getModules);
router.post('/', verifyToken, modulesController.createModule);
router.put('/:id', verifyToken, modulesController.updateModule);
router.delete('/:id', verifyToken, modulesController.deleteModule);

export default router;
