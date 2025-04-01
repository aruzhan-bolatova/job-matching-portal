import { Request, Response } from 'express';
import Job from '../models/Job';

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private
export const createJob = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized: No user found' });
            return;
        }

        const { title, company, description, requirements, location, salary, type } = req.body;
        // Validate required fields
        if (!title || !company || !description || !requirements || !location || !salary || !type) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }


        const job = await Job.create({
            title,
            company,
            description,
            requirements,
            location,
            salary,
            type,
            postedBy: req.user.id, // user is added via authMiddleware
        });

        res.status(201).json(job);
    } catch (error: any) {
        res.status(400).json({ error: error.message || 'Job creation failed' });
    }
};

// @desc    Get all jobs with filters
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req: Request, res: Response) => {
    try {
        const jobs = await Job.find({ isDeleted: false });
        res.json(jobs);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req: Request, res: Response) => {
    try {
        //const job = await Job.findById(req.params.id);
        const job = await Job.findOne({ _id: req.params.id, isDeleted: false }); // Ensure job is not deleted
        if (!job) { res.status(404).json({ message: 'Job not found' }); return; }

        res.status(200).json(job);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private
export const updateJob = async (req: Request, res: Response) => {
    try {

        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized: No user found' });
            return;
        }

        //const job = await Job.findById(req.params.id);
        const job = await Job.findOne({ _id: req.params.id, isDeleted: false });  // Ensure job is not deleted
        if (!job) {
            res.status(404).json({ message: 'Job not found' });
            return;
        }

        if (job.postedBy.toString() !== req.user.id) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedJob);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private
export const deleteJob = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized: No user found' });
            return;
        }

        const job = await Job.findById(req.params.id);
        if (!job) {res.status(404).json({ message: 'Job not found' }); return;}

        if (job.postedBy.toString() !== req.user.id) {
            res.status(401).json({ message: 'Not authorized' });
            return; 
        }

        // Perform soft delete instead of removing
        job.isDeleted = true;
        await job.save();

        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get recommended jobs for the user
// @route   GET /api/jobs/recommended
// @access  Private
export const getRecommendedJobs = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized: No user found' });
            return;
        }

        // Example: Recommend jobs based on the user's skills (assuming `req.user.skills`)
        const recommendedJobs = await Job.find({ 
            requirements: { $in: req.user.skills },
            isDeleted: false  // Exclude deleted jobs 
        });

        res.status(200).json(recommendedJobs);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};