import Router from 'express';
import {addCategory, getAllCategories} from "../controllers/categoriesControllers.js";

const router = Router();

router.get('', getAllCategories);
router.post('', addCategory);

export default router;