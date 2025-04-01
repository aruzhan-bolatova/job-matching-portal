import { Request, Response } from 'express';
import User from '../models/User';

// @desc    Register user
// @route   POST /api/users/
export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, role, skills } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) { res.status(400).json({ message: 'User already exists' }); return; }

        // Create new user
        const user = new User({ name, email, role, skills });
        await user.save();

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// @desc    Get all users
// @route   GET /api/users/
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// @desc    GEt user by ID
// @route   GET /api/users/:id
export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) { res.status(404).json({ message: 'User not found' }); return; }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// @desc    Update user by ID
// @route   PUT /api/users/:id
export const updateUserById = async (req: Request, res: Response) => {
    try {
        const { name, email, role, skills } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, role, skills },
            { new: true }
        );

        if (!user) 
            {
                res.status(404).json({ message: 'User not found' });
                return; 
            }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// @desc    Delete user by ID
// @route   DELETE /api/users/:id
export const deleteUserById = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) 
            {
                res.status(404).json({ message: 'User not found' });
                return; 
            }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// @desc    Get all employers
// @route   GET /api/users/employers
export const getEmployers = async (req: Request, res: Response) => {
    try {
        console.log("Fetching employers...");
        const employers = await User.find({ role: 'employer' }).select('-password');
        console.log("Employers found:", employers);
        res.json(employers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

/// @desc    Get all jobseekers
// @route   GET /api/users/jobseekers
export const getJobSeekers = async (req: Request, res: Response) => {
    try {
        const jobSeekers = await User.find({ role: 'jobseeker' }).select('-password');
        res.json(jobSeekers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};