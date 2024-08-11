import express from 'express';
import { registerUser, loginUser, meUser, updateUserRoleById } from '../controllers/users';
import { auth, authAdmin } from '../middleware/auth';

const router = express.Router();

router.post(`/register`, registerUser);
router.post(`/login`, loginUser);
router.get('/me', auth, meUser);
router.put('/:id/role', authAdmin, updateUserRoleById);

export default router;