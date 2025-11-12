import mongoose from 'mongoose';

mongoose
  .connect('mongodb://localhost:27017/plumeBlog')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
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
  tags: [{
    type: String,
    lowercase: true
  }],
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
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes for performance
blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ status: 1, published_at: -1 });
blogPostSchema.index({ tags: 1 });
blogPostSchema.index({ author: 1 });

export const BlogPost = mongoose.model('BlogPost', blogPostSchema);