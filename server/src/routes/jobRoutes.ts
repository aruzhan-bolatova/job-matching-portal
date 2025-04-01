import express from 'express';
import { createJob, getJobs, getJobById, updateJob, deleteJob, getRecommendedJobs } from '../controllers/jobController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', protect, createJob);  // Create a job (protected)
router.get('/', getJobs);  // Get all jobs with filters
router.get('/recommended', protect, getRecommendedJobs);  // Get recommended jobs for user
router.get('/:id', getJobById);  // Get job by ID
router.put('/:id', protect, updateJob);  // Update job (protected)
router.delete('/:id', protect, deleteJob);  // Delete job (protected)

export default router;