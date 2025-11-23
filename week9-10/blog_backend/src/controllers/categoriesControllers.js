import { category } from "../models/categoriesDB.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await category.find().exec();
    res.json(categories);

  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      error: 'Failed to fetch categories'
    });
  }
};

export const addCategory = async (req, res) => {
    try {
        const newCategory = category.insertOne(req.body);
        await newCategory.save();
        res.json(newCategory);
        console.log(`New category added: ${newCategory.name}`);
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({ error: 'Failed to add category' });
    }
}

export const removeCategory = async (req, res) => {
    try {
        const {id} = req.params.id;
        await category.findByIdAndDelete(id);
        res.json({message: 'Category deleted successfully'});
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
}