import express from 'express';
import { createBook, getBooks, getBookById, updateBookById, deleteBookById } from '../controllers/books';
import { authAdmin } from '../middleware/auth';

const router = express.Router();

router.post(`/books`, authAdmin, createBook);
router.get('/books', getBooks);
router.get(`/books/:id`, getBookById);
router.put('/books/:id', authAdmin, updateBookById);
router.delete(`/books/:id`, authAdmin, deleteBookById);

export default router;