import Router from 'express';
import {
	getPosts,
	getPostById,
	createPost,
	updatePost,
	deletePost,
    getTrendingPosts,
    getRelated
} from '../controllers/postController.js';
import { uploadImage } from "../middlewares/uploadImage.js";

const router = Router();

router.get('/trending', getTrendingPosts);
router.get('/:id', getPostById);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);
router.get('/', getPosts);
router.post('/', uploadImage, createPost);
router.get('/:id/related', getRelated);
router.patch('/:id/like', updatePost);
router.patch('/:id/publish', updatePost);

export default router;
