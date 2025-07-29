import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getPublicSessions,
  getMySessions,
  getSessionById,
  saveDraftSession,
  publishSession,
} from '../controllers/sessionController.js'; 

const router = express.Router();

router.get('/sessions', getPublicSessions); 
router.use(protect);

router.get('/my-sessions', getMySessions); 
router.get('/my-sessions/:id', getSessionById); 
router.post('/my-sessions/save-draft', saveDraftSession); 
router.post('/my-sessions/publish', publishSession); 

export default router;