import mongoose from './connect.js';

import './usersDB.js';
import './tagsDB.js';
import './categoriesDB.js';

const blogPostSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
			maxlength: 200
		},
		slug: {
			type: String,
			required: true,
			lowercase: true,
			unique: true
		},
		content: {
			type: String,
			required: true
		},
		excerpt: {
			type: String,
			maxlength: 300
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		status: {
			type: String,
			enum: ['draft', 'published', 'archived'],
			default: 'draft'
		},
		featured: {
			type: Boolean,
			default: false
		},
		category: {
			type: String,
			required: true
		},
		tags: [
			{
				type: String,
				ref: 'tags',
				lowercase: true
			}
		],
		featured_image: String,
		views: {
			type: Number,
			default: 0
		},
		likes: {
			type: Number,
			default: 0
		},
		reading_time: Number,
		published_at: Date
	},
	{
		timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
	}
);

blogPostSchema.index({ title: 1, author: 1 }, { unique: true });
blogPostSchema.index({ status: 1, published_at: -1 });
blogPostSchema.index({ tags: 1 });
blogPostSchema.index({ author: 1 });

blogPostSchema.pre('save', async function (next) {
	if (this.isNew) {
		const existingPost = await mongoose.model('BlogPost').findOne({
			title: this.title,
			author: this.author
		});

		if (existingPost) {
			const error = new Error('A post with this title already exists by the same author');
			return next(error);
		} else {
			this.slug = this.title
				.toLowerCase()
				.replace(/[^\w\s-]/g, '')
				.replace(/[\s_-]+/g, '-')
				.replace(/^-+|-+$/g, '');
		}
		const wordsPerMinute = 200;
		const words = this.content.split(/\s+/).length;
		this.reading_time = Math.ceil(words / wordsPerMinute);
	}
	next();
});

blogPostSchema.pre('findOneAndUpdate', async function (next) {
	const existingPost = await mongoose.model('BlogPost').findOne({
		title: this._update.title,
		author: this._update.author
	});
	if (existingPost) {
		const error = new Error('A post with this title already exists by the same author');
		return next(error);
	}
	next();
});

export const BlogPost = mongoose.model('BlogPost', blogPostSchema);
