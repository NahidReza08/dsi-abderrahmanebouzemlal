import {BlogPost} from '../models/blogPostDB.js';

export const getPosts = async (req, res) => {
    const posts = await BlogPost.find({});
    res.json(posts);
}

export const getPostById = async (req, res) => {}

export const createPost = async (req, res) => {}

export const updatePost = async (req, res) => {}

export const deletePost = async (req, res) => {}

export const likePost = async (req, res) => {}

export const viewPost = async (req, res) => {}

export const publishPost = async (req, res) => {}

export const getDraftPosts = async (req, res) => {}