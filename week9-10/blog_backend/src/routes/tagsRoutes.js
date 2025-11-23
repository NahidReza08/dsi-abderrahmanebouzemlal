import Router from 'express';
import {getTags, addTag} from '../controllers/tagsControllers.js';

const router = Router();

router.get('', getTags);
router.post('', addTag);

export default router;