import { Request, Response } from 'express';
import Application from '../models/Application';
import Job from '../models/Job';

// @desc    Submit application
// @route   POST /api/applications
// @access  Private
export const submitApplication = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        const { jobId, resume, coverLetter } = req.body;

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            res.status(404).json({ message: 'Job not found' });
            return;
        }

        const application = await Application.create({
            job: jobId,
            applicant: req.user.id,
            resume,
            coverLetter,
        });

        res.status(201).json(application);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// @desc    Get applications for current user
// @route   GET /api/applications
// @access  Private
export const getUserApplications = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        const applications = await Application.find({ applicant: req.user.id }).populate('job');
        res.json(applications);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get application by ID
// @route   GET /api/applications/:id
// @access  Private
export const getApplicationById = async (req: Request, res: Response) => {
    try {
        const application = await Application.findById(req.params.id).populate('job applicant');
        if (!application) {
            res.status(404).json({ message: 'Application not found' });
            return;
        }

        res.json(application);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Update application status (admin/employer only)
// @route   PUT /api/applications/:id
// @access  Private (Employer)
export const updateApplicationStatus = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        const application = await Application.findById(req.params.id);
        if (!application) {
            res.status(404).json({ message: 'Application not found' });
            return;
        }

        // Only allow employer to update application status
        const job = await Job.findById(application.job);
        if (job?.postedBy?.toString() !== String(req.user.id)) {
            res.status(403).json({ message: 'Not authorized to update this application' });
            return;
        }

        application.status = req.body.status || application.status;
        await application.save();

        res.json(application);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get all applications for a job (Employer only)
// @route   GET /api/jobs/:id/applications
// @access  Private (Employer)
export const getJobApplications = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        const job = await Job.findById(req.params.id);
        if (!job) {
            res.status(404).json({ message: 'Job not found' });
            return;
        }

        // Only the employer who posted the job can view applications
        if (job.postedBy.toString() !== String(req.user.id)) {
            res.status(403).json({ message: 'Not authorized to view applications for this job' });
            return;
        }

        const applications = await Application.find({ job: req.params.id }).populate('applicant');
        res.json(applications);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};