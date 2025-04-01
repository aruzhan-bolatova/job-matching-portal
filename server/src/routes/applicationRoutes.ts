import express from 'express';
import {
  submitApplication,
  getUserApplications,
  getApplicationById,
  updateApplicationStatus,
  getJobApplications,
} from '../controllers/applicationController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', protect, submitApplication);
router.get('/', protect, getUserApplications);
router.get('/:id', protect, getApplicationById);
router.put('/:id', protect, updateApplicationStatus);
router.get('/jobs/:id/applications', protect, getJobApplications);

export default router;