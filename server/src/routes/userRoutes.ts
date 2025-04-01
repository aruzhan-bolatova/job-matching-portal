/**
 * User Routes
 *
 * This module defines the routes for user-related operations in the application.
 * It uses Express Router to handle HTTP requests and delegates the logic to the
 * corresponding controller functions.
 *
 * Routes:
 * - POST `/` - Create a new user. Delegates to `createUser`.
 * - GET `/` - Retrieve all users. Delegates to `getAllUsers`.
 * - GET `/employers` - Retrieve all employers. Delegates to `getEmployers`.
 * - GET `/jobseekers` - Retrieve all job seekers. Delegates to `getJobSeekers`.
 * - GET `/:id` - Retrieve a user by their ID. Delegates to `getUserById`.
 * - PUT `/:id` - Update a user by their ID. Delegates to `updateUserById`.
 * - DELETE `/:id` - Delete a user by their ID. Delegates to `deleteUserById`.
 */
import express from 'express';

import {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getEmployers,
  getJobSeekers
} from '../controllers/userController';

const router = express.Router();

router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/employers', getEmployers);
router.get('/jobseekers', getJobSeekers);
router.get('/:id', getUserById);
router.put('/:id', updateUserById);
router.delete('/:id', deleteUserById);


export default router;