import express from 'express';
import { UserController } from './user.controller';

const router = express.Router();

// Order matters - specific routes first, then dynamic params
router.post('/', UserController.createUser);
router.post('/login', UserController.loginUser);
router.get('/role/:email', UserController.userRole);
router.get('/email/:email', UserController.getSingleUser);
router.get('/', UserController.getAllUsers);
router.patch('/:id', UserController.updateUser);
router.patch('/:id/fraud', UserController.updateFraudStatus);

export const UserRoutes = router;