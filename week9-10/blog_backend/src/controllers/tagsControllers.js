import { tags } from '../models/tagsDB.js';

export const getTags = async (req, res) => {
	try {
		const Tags = await tags.find({}).exec();
		res.json(Tags);
	} catch (error) {
		console.error('Error fetching tags:', error);
		res.status(500).json({
			error: 'Failed to fetch tags'
		});
	}
};

export const addTag = async (req, res) => {
	try {
		const newTag = tags(req.body);
		await newTag.save();
		res.status(201).json(newTag);
	} catch (error) {
		console.error('Error adding tag:', error);
		res.status(500).json({ error: 'Failed to add tag' });
	}
};
