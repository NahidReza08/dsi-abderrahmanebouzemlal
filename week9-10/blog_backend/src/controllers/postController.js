import { BlogPost } from '../models/blogPostDB.js';
import fs from 'node:fs';
import mongoose from 'mongoose';

export const getPosts = async (req, res) => {
	try {
		const blogPosts = await BlogPost.find({ status: 'published' })
			.populate('author', 'username profile_picture')
			.sort({ published_at: -1 })
			.lean()
			.exec();
		res.json(blogPosts);
	} catch (error) {
		console.error('Error fetching posts:', error);
		res.status(500).json({ error: 'Failed to fetch posts' });
	}
};

export const getTrendingPosts = async (req, res) => {
	try {
		const posts = await BlogPost.find({ status: 'published' })
			.populate('author', 'username profile_picture')
			.sort({ views: -1, likes: -1 })
			.limit(10)
			.lean()
			.exec();

		res.json(posts);
	} catch (error) {
		console.error('Error fetching trending posts:', error);
		res.status(500).json({ error: error.message });
	}
};

export const getPostById = async (req, res) => {
	try {
		const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ error: 'Invalid post ID' });
		}
		const post = await BlogPost.findById(id)
			.populate('author', 'username profile_picture bio')
			.sort({ published_at: -1 })
			.exec();
		console.log(post.featured_image);
		if (!post) {
			return res.status(404).json({ error: 'Post not found' });
		}

		res.json(post);
	} catch (error) {
		console.error('Error fetching post:', error);
		res.status(500).json({ error: 'Failed to fetch post' });
	}
};

export const getRelated = async (req, res) => {
	try {
		const { id } = req.params;
		const post = await BlogPost.findById(id)
			.populate('author', 'username profile_picture bio')
			.sort({ published_at: -1 })
			.exec();
		const related = await BlogPost.find({ category: post.category })
			.populate('author', 'username profile_picture bio')
			.sort({ published_at: -1 })
			.exec();
		res.json(related);
	} catch (error) {
		console.error('Error fetching related posts:', error);
		res.status(500).json({ error: 'Failed to fetch related posts' });
	}
};

export const createPost = async (req, res) => {
	try {
		const postData = {
			...req.body,
			slug: req.body.title
		};

		if (req.file) {
			postData.featured_image = `/uploads/images/${req.file.filename}`;
			console.log('featured Image', postData.featured_image);
		}

		const newPost = new BlogPost(postData);
		await newPost.save();
		res.status(201).json(newPost);
	} catch (error) {
		if (req.file) {
			fs.unlink(req.file.path, (err) => {
				if (err) console.error('Error deleting file:', err);
			});
		}

		console.error('Error creating post:', error);

		if (error.name === 'ValidationError') {
			return res.status(400).json({ error: error.message });
		}

		res.status(500).json({ error: 'Failed to create post' });
	}
};

export const updatePost = async (req, res) => {
	try {
		const updatedPost = await BlogPost.findOneAndUpdate(
			{ id: req.params.id },
			{ ...req.body, updatedAt: new Date() },
			{ new: true, runValidators: true }
		);

		if (!updatedPost) {
			return res.status(404).json({ error: 'Post not found' });
		}

		res.json(updatedPost);
	} catch (error) {
		console.error('Error updating post:', error);

		if (error.name === 'ValidationError') {
			return res.status(400).json({ error: error.message });
		}

		res.status(500).json({ error: 'Failed to update post' });
	}
};

export const deletePost = async (req, res) => {
	try {
		const deletedPost = await BlogPost.findByIdAndDelete(req.params.id);

		if (!deletedPost) {
			return res.status(404).json({ error: 'Post not found' });
		}

		res.status(204).send();
	} catch (error) {
		console.error('Error deleting post:', error);
		res.status(500).json({ error: 'Failed to delete post' });
	}
};

export const likePost = async (req, res) => {
	try {
		const { id } = req.params;
		const post = await BlogPost.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true });

		if (!post) {
			return res.status(404).json({ error: 'Post not found' });
		}

		res.json(post);
	} catch (error) {
		console.error('Error liking post:', error);
		res.status(500).json({ error: 'Failed to like post' });
	}
};

export const publishPost = async (req, res) => {
	try {
		const { id } = req.params;
		const post = await BlogPost.findByIdAndUpdate(
			id,
			{
				published: true,
				publishedAt: new Date()
			},
			{ new: true, runValidators: true }
		);

		if (!post) {
			return res.status(404).json({ error: 'Post not found' });
		}

		res.json(post);
	} catch (error) {
		console.error('Error publishing post:', error);
		res.status(500).json({ error: 'Failed to publish post' });
	}
};

export const getDraftPosts = async (req, res) => {
	try {
		const draftPosts = await BlogPost.find({ published: false }).exec();
		res.json(draftPosts);
	} catch (error) {
		console.error('Error fetching draft posts:', error);
		res.status(500).json({ error: 'Failed to fetch draft posts' });
	}
};
