import mongoose from 'mongoose';
import { category } from './src/models/categoriesDB.js';
import { tags } from './src/models/tagsDB.js';
import { BlogPost } from './src/models/blogPostDB.js';
import { User } from './src/models/usersDB.js';

const blogPostsData = [
	{
		id: 1,
		title: 'The Future of AI in Everyday Life',
		description:
			'Exploring how artificial intelligence is seamlessly integrating into daily routines, from smart homes to personalized healthcare solutions.',
		author: {
			name: 'Elena Rodriguez',
			picture: '/Image/blog-avatar/06.png'
		},
		article_photo: '/Image/blog-thumbnail/01.png',
		featured: true,
		publish_date: '2025-03-15T10:00:00Z',
		read_time_minutes: 8,
		status: 'published',
		category: 'Technology',
		tags: ['AI', 'Future Tech', 'Innovation'],
		likes: 30
	},
	{
		id: 2,
		title: 'Mastering Remote Work: Tools and Tips',
		description:
			'A comprehensive guide to thriving in a remote work environment with the best collaboration tools and productivity hacks.',
		author: {
			name: 'Marcus Chen',
			picture: '/Image/blog-avatar/07.png'
		},
		article_photo: '/Image/blog-thumbnail/02.png',
		featured: false,
		publish_date: '2025-03-18T14:30:00Z',
		read_time_minutes: 10,
		status: 'published',
		category: 'Productivity',
		tags: ['Remote Work', 'Tools', 'Career'],
		likes: 20
	},
	{
		id: 3,
		title: 'Sustainable Living in Urban Spaces',
		description:
			'Practical strategies for reducing your carbon footprint while living in bustling city environments.',
		author: {
			name: 'Sofia Patel',
			picture: '/Image/blog-avatar/04.png'
		},
		article_photo: '/Image/blog-thumbnail/03.png',
		featured: true,
		publish_date: '2025-03-20T09:15:00Z',
		read_time_minutes: 7,
		status: 'published',

		category: 'Lifestyle',
		tags: ['Sustainability', 'Urban Living', 'Eco-Friendly'],
		likes: 209
	},
	{
		id: 4,
		title: 'The Rise of Quantum Computing',
		description:
			'An in-depth look at quantum computing breakthroughs and their potential to revolutionize industries.',
		author: {
			name: "Dr. Liam O'Connor",
			picture: '/Image/blog-avatar/03.png'
		},
		article_photo: '/Image/blog-thumbnail/04.png',
		featured: false,
		publish_date: '2025-03-22T11:45:00Z',
		read_time_minutes: 12,
		status: 'published',

		category: 'Science',
		tags: ['Quantum', 'Computing', 'Tech'],
		likes: 203
	},
	{
		id: 5,
		title: 'Mindfulness Practices for Busy Professionals',
		description:
			'Quick and effective mindfulness techniques to reduce stress and improve focus during hectic workdays.',
		author: {
			name: 'Aisha Khan',
			picture: '/Image/blog-avatar/05.png'
		},
		article_photo: '/Image/blog-thumbnail/05.png',
		featured: false,
		publish_date: '2025-03-25T08:00:00Z',
		read_time_minutes: 6,
		status: 'published',
		category: 'Wellness',
		likes: 340,

		tags: ['Mindfulness', 'Health', 'Productivity']
	},
	{
		id: 6,
		title: 'Decoding Blockchain Beyond Cryptocurrency',
		description:
			'Understanding blockchain applications in supply chain, healthcare, and voting systems.',
		author: {
			name: 'Marcus Chen',
			picture: '/Image/blog-avatar/07.png'
		},
		article_photo: '/Image/blog-thumbnail/06.png',
		featured: true,
		publish_date: '2025-03-28T13:20:00Z',
		read_time_minutes: 9,
		status: 'published',
		category: 'Technology',
		likes: 230,

		tags: ['Blockchain', 'Web3', 'Innovation']
	},
	{
		id: 7,
		title: 'The Art of Digital Detox',
		description:
			'How to unplug from technology and reclaim your time and mental clarity in a hyper-connected world.',
		author: {
			name: 'Elena Rodriguez',
			picture: '/Image/blog-avatar/06.png'
		},
		article_photo: '/Image/blog-thumbnail/07.png',
		featured: false,
		likes: 2086,
		publish_date: '2025-04-01T10:30:00Z',
		read_time_minutes: 7,
		status: 'published',
		category: 'Wellness',
		tags: ['Digital Detox', 'Mental Health', 'Balance']
	},
	{
		id: 8,
		title: 'Climate Change: Actionable Steps for Individuals',
		description:
			'Small but impactful changes you can make today to combat climate change and protect the planet.',
		author: {
			name: 'Sofia Patel',
			picture: '/Image/blog-avatar/04.png'
		},
		likes: 34,
		article_photo: '/Image/blog-thumbnail/08.png',
		featured: false,
		publish_date: '2025-04-03T15:00:00Z',
		read_time_minutes: 8,
		status: 'published',
		category: 'Environment',
		tags: ['Climate', 'Sustainability', 'Activism']
	},
	{
		id: 9,
		title: 'Building Resilient Teams in Hybrid Workplaces',
		description:
			'Strategies for fostering collaboration and morale in teams split between office and remote work.',
		author: {
			name: "Dr. Liam O'Connor",
			picture: '/Image/blog-avatar/03.png'
		},
		article_photo: '/Image/blog-thumbnail/09.png',
		likes: 90,
		featured: true,
		publish_date: '2025-04-05T11:00:00Z',
		read_time_minutes: 11,
		status: 'published',
		category: 'Business',
		tags: ['Leadership', 'Hybrid Work', 'Team Building']
	},
	{
		id: 10,
		title: 'The Psychology of Habit Formation',
		description:
			'Science-backed methods to create lasting habits and break unwanted behavioral patterns.',
		author: {
			name: 'Aisha Khan',
			picture: '/Image/blog-avatar/05.png'
		},
		article_photo: '/Image/blog-thumbnail/10.png',
		featured: false,
		publish_date: '2025-04-08T09:45:00Z',
		status: 'published',
		read_time_minutes: 9,
		category: 'Psychology',
		tags: ['Habits', 'Self-Improvement', 'Science']
	},
	{
		id: 11,
		title: 'Edge Computing: The Next Frontier',
		description:
			'How edge computing is reducing latency and transforming IoT, gaming, and real-time analytics.',
		author: {
			name: 'Raj Kapoor',
			picture: '/Image/blog-avatar/12.png'
		},
		article_photo: '/Image/blog-thumbnail/11.png',
		featured: false,
		publish_date: '2025-04-10T14:15:00Z',
		read_time_minutes: 10,
		status: 'published',
		category: 'Technology',
		tags: ['Edge Computing', 'IoT', 'Performance']
	},
	{
		id: 12,
		title: 'Ethical AI: Balancing Innovation and Responsibility',
		description: 'Navigating the moral challenges of AI development and deployment in society.',
		author: {
			name: 'Elena Rodriguez',
			picture: '/Image/blog-avatar/06.png'
		},
		article_photo: '/Image/blog-thumbnail/12.png',
		featured: true,
		publish_date: '2025-04-12T12:00:00Z',
		likes: 0,
		status: 'published',
		read_time_minutes: 13,
		category: 'Ethics',
		tags: ['AI Ethics', 'Responsibility', 'Tech Policy']
	},
	{
		id: 13,
		title: 'Zero-Waste Cooking: Recipes and Techniques',
		description: 'Creative ways to use every part of your ingredients and reduce kitchen waste.',
		author: {
			name: 'Sofia Patel',
			picture: '/Image/blog-avatar/04.png'
		},
		article_photo: '/Image/blog-thumbnail/12.png',
		featured: false,
		publish_date: '2025-04-15T10:00:00Z',
		status: 'published',
		read_time_minutes: 7,
		likes: 1023,
		category: 'Food',
		tags: ['Cooking', 'Sustainability', 'Recipes']
	},
	{
		id: 14,
		title: 'The Evolution of Cloud Security',
		description:
			'From basic encryption to AI-driven threat detection: the future of protecting cloud infrastructure.',
		author: {
			name: 'Marcus Chen',
			picture: '/Image/blog-avatar/07.png'
		},
		article_photo: '/Image/blog-thumbnail/13.png',
		featured: false,
		publish_date: '2025-04-18T13:30:00Z',
		status: 'published',
		read_time_minutes: 11,
		likes: 98900,
		category: 'Cybersecurity',
		tags: ['Cloud', 'Security', 'Tech']
	},
	{
		id: 15,
		title: 'Sleep Science: Optimizing Rest for Peak Performance',
		description:
			'Cutting-edge research on sleep cycles, recovery, and cognitive enhancement through better rest.',
		author: {
			name: 'Aisha Khan',
			picture: '/Image/blog-avatar/05.png'
		},
		article_photo: '/Image/blog-thumbnail/14.png',
		status: 'published',
		featured: true,
		publish_date: '2025-04-20T08:00:00Z',
		read_time_minutes: 9,
		likes: 0,
		category: 'Health',
		tags: ['Sleep', 'Performance', 'Science']
	},
	{
		id: 16,
		title: "Decentralized Finance: A Beginner's Guide",
		description:
			'Understanding DeFi protocols, yield farming, and the shift from traditional banking.',
		author: {
			name: 'Raj Kapoor',
			picture: '/Image/blog-avatar/12.png'
		},
		article_photo: '/Image/blog-thumbnail/15.png',
		featured: false,
		status: 'published',
		publish_date: '2025-04-22T11:15:00Z',
		likes: 0,
		read_time_minutes: 10,
		category: 'Finance',
		tags: ['DeFi', 'Crypto', 'Blockchain']
	},
	{
		id: 17,
		title: 'The Impact of 6G on Global Connectivity',
		description:
			'What to expect from the next generation of wireless technology and its societal implications.',
		author: {
			name: "Dr. Liam O'Connor",
			picture: '/Image/blog-avatar/03.png'
		},
		article_photo: '/Image/blog-thumbnail/16.png',
		status: 'published',
		featured: false,
		likes: 0,
		publish_date: '2025-04-25T14:00:00Z',
		read_time_minutes: 12,
		category: 'Technology',
		tags: ['6G', 'Connectivity', 'Future']
	},
	{
		id: 18,
		title: 'Urban Farming: Growing Food in Small Spaces',
		description: 'Innovative techniques for cultivating fresh produce in apartments and rooftops.',
		author: {
			name: 'Sofia Patel',
			picture: '/Image/blog-avatar/04.png'
		},
		article_photo: '/Image/blog-thumbnail/17.png',
		featured: false,
		status: 'published',
		publish_date: '2025-04-28T09:30:00Z',
		read_time_minutes: 8,
		category: 'Lifestyle',
		likes: 0,
		tags: ['Farming', 'Urban', 'Sustainability']
	},
	{
		id: 19,
		title: 'AI-Powered Personal Finance Tools',
		description:
			'How machine learning is revolutionizing budgeting, investing, and financial planning.',
		author: {
			name: 'Raj Kapoor',
			picture: '/Image/blog-avatar/12.png'
		},
		article_photo: '/Image/blog-thumbnail/18.png',
		featured: true,
		likes: 0,
		status: 'published',
		publish_date: '2025-05-01T12:45:00Z',
		read_time_minutes: 9,
		category: 'Finance',
		tags: ['AI', 'Finance', 'Tools']
	},
	{
		id: 20,
		title: 'The Neuroscience of Creativity',
		description:
			"Unlocking the brain's creative potential through understanding neural pathways and flow states.",
		author: {
			name: 'Aisha Khan',
			picture: 'https://i.pravatar.cc/150?img=5'
		},
		article_photo:
			'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
		featured: false,
		status: 'published',
		publish_date: '2025-05-03T10:00:00Z',
		read_time_minutes: 11,
		likes: 0,
		category: 'Science',
		tags: ['Creativity', 'Neuroscience', 'Brain']
	},
	{
		id: 21,
		title: 'Cybersecurity in the Age of IoT',
		description:
			'Protecting interconnected devices from evolving threats in smart homes and cities.',
		author: {
			name: 'Marcus Chen',
			picture: '/Image/blog-avatar/07.png'
		},
		article_photo: '/Image/blog-thumbnail/20.png',
		featured: false,
		status: 'published',
		publish_date: '2025-05-05T13:15:00Z',
		likes: 0,
		read_time_minutes: 10,
		category: 'Cybersecurity',
		tags: ['IoT', 'Security', 'Smart Devices']
	},
	{
		id: 22,
		title: 'Regenerative Agriculture: Healing the Soil',
		description:
			'How modern farming practices are restoring ecosystems and improving food security.',
		author: {
			name: "Dr. Liam O'Connor",
			picture: '/Image/blog-avatar/03.png'
		},
		article_photo: '/Image/blog-thumbnail/21.png',
		featured: true,
		likes: 534,
		publish_date: '2025-05-07T11:30:00Z',
		status: 'published',
		read_time_minutes: 12,
		category: 'Environment',
		tags: ['Agriculture', 'Sustainability', 'Ecosystem']
	}
];
const authorsData = [
	{
		name: 'Elena Rodriguez',
		bio: 'AI ethicist and tech journalist with a focus on responsible innovation.',
		picture: './media/person-icon-1684.jpg',
		total_posts: 3
	},
	{
		name: 'Marcus Chen',
		bio: 'Full-stack developer and cybersecurity specialist.',
		total_posts: 4
	},
	{
		name: 'Sofia Patel',
		bio: 'Sustainability advocate and urban lifestyle writer.',
		total_posts: 4
	},
	{
		name: "Dr. Liam O'Connor",
		bio: 'Physicist and science communicator specializing in emerging technologies.',
		total_posts: 4
	},
	{
		name: 'Aisha Khan',
		bio: 'Clinical psychologist and wellness researcher.',
		total_posts: 4
	},
	{
		name: 'Raj Kapoor',
		bio: 'FinTech entrepreneur and blockchain educator.',
		total_posts: 3
	}
];
const categories = [
	'Technology',
	'Web Development',
	'JavaScript',
	'Svelte',
	'Frontend',
	'Backend',
	'DevOps',
	'AI & Machine Learning',
	'Data Science',
	'Productivity',
	'Career',
	'Startups',
	'Entrepreneurship',
	'Remote Work',
	'Personal Development',
	'Self-Improvement',
	'Minimalism',
	'Finance',
	'Investing',
	'Crypto & Blockchain',
	'Travel',
	'Digital Nomad',
	'Food & Cooking',
	'Health & Fitness',
	'Mental Health',
	'Books & Reading',
	'Writing',
	'Design',
	'UI/UX',
	'Photography',
	'Parenting',
	'Relationships',
	'Lifestyle',
	'Sustainability',
	'Environment',
	'Science',
	'Wellness',
	'Business',
	'Psychology',
	'Cybersecurity',
	'Food',
	'Health',
	'Ethics'
];
const Tags = [
	'JavaScript',
	'TypeScript',
	'Svelte',
	'SvelteKit',
	'React',
	'Vue',
	'Node.js',
	'Python',
	'Docker',
	'AWS',
	'Tailwind CSS',
	'Frontend',
	'Backend',
	'Full-Stack',
	'Web Performance',
	'Accessibility',
	'SEO',
	'Jamstack',
	'Serverless',
	'GraphQL',
	'Open Source',
	'GitHub',
	'Productivity',
	'Notion',
	'Remote Work',
	'Digital Nomad',
	'Career Advice',
	'Freelancing',
	'Startups',
	'SaaS',
	'AI',
	'ChatGPT',
	'Machine Learning',
	'Finance',
	'Investing',
	'Crypto',
	'Blockchain',
	'Web3',
	'Travel',
	'Minimalism',
	'Mental Health',
	'Mindfulness',
	'Fitness',
	'Cooking',
	'Vegan',
	'Books',
	'Writing',
	'Design',
	'Figma',
	'Photography',
	'Parenting',
	'Sustainability',
	'Climate Change',
	'Zero Waste',
	'IoT',
	'Security',
	'DeFi',
	'6G'
];

async function seed() {
	try {
		await mongoose.connect('mongodb://localhost:27017/plumeBlog');
		console.log('Connected to MongoDB');

		// 1. Clear old data (optional — remove if you want to keep existing posts)

		await Promise.all([
			User.deleteMany({}),
			BlogPost.deleteMany({}),
			category.deleteMany({}),
			tags.deleteMany({})
		]);

		// 2. Seed Categories
		const catDocs = await category.find({});
		const existingCats = new Set(catDocs.map((c) => c.name));
		const newCats = categories
			.filter((name) => !existingCats.has(name))
			.map((name) => ({ name, postCount: 0, isActive: true }));

		if (newCats.length) {
			await category.insertMany(newCats);
			console.log(`Added ${newCats.length} categories`);
		}

		// 3. Seed Tags
		const tagDocs = await tags.find({});
		const existingTags = new Set(tagDocs.map((t) => t.name));
		const newTags = Tags.filter((name) => !existingTags.has(name)).map((name) => ({
			name,
			postCount: 0,
			isActive: true
		}));

		if (newTags.length) {
			await tags.insertMany(newTags);
			console.log(`Added ${newTags.length} Tags`);
		}

		// 4. Seed Authors (Users)
		const usersMap = {};
		for (const post of blogPostsData) {
			if (!usersMap[post.author.name]) {
				let user = await User.findOne({
					username: post.author.name.toLowerCase().replace(/\s+/g, '_')
				});
				if (!user) {
					user = await User.create({
						username: post.author.name.toLowerCase().replace(/\s+/g, '_'),
						email: `${post.author.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
						password: 'temp123', // will be hashed by pre-save hook
						profile_picture: post.author.picture,
						is_verified: true
					});
					console.log(`Created author: ${post.author.name}`);
				}
				usersMap[post.author.name] = user._id;
			}
		}

		// 5. Seed Blog Posts
		for (const post of blogPostsData) {
			const exists = await BlogPost.findOne({ title: post.title });
			if (exists) continue; // skip if already exists

			const content = `
        <h1>${post.title}</h1>
        <p><strong>${post.description}</strong></p>
        <p>This is a rich, detailed article exploring <em>${post.title}</em>. 
        We dive deep into real-world applications, expert insights, and practical takeaways.</p>
        <h2>Key Insights</h2>
        <ul>
          <li>${post.tags[0]} is transforming how we think about technology</li>
          <li>Practical strategies you can implement today</li>
          <li>Future trends to watch in the next 5 years</li>
        </ul>
        <blockquote>The future belongs to those who prepare for it today.</blockquote>
        <p>Join the conversation in the comments below!</p>
      `;

			await BlogPost.create({
				title: post.title,
				slug: post.title
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, '-')
					.replace(/(^-|-$)/g, ''),
				content,
				excerpt: post.description,
				author: usersMap[post.author.name],
				featured_image: post.article_photo,
				category: post.category,
				tags: post.tags.map((t) => t.toLowerCase()),
				status: 'published',
				featured: post.featured,
				reading_time: post.read_time_minutes,
				published_at: new Date(post.publish_date),
				likes: post.likes || 0,
				views: Math.floor(Math.random() * 1500)
			});
		}

		console.log('All data seeded successfully!');
		console.log(`Total posts: ${await BlogPost.countDocuments()}`);
		console.log(`Total authors: ${await User.countDocuments({ role: 'user' })}`);
		console.log(await User.find({}).exec());
	} catch (error) {
		console.error('Seeding failed:', error.message);
	} finally {
		await mongoose.connection.close();
	}
}

seed();
