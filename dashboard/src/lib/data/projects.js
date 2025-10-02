// @ts-ignore
const basePath = import.meta.env.BASE_URL || '/';

export const projects = [
  {
    id: 1,
    name: "Pomodoro todo list app",
    description: "A pomodoro timer integrated with a todo list, built with Svelte and styled using Tailwind CSS.",
    category: "Todo",
    image: `${basePath}pomodoro-preview.jpg`,
    lastUpdated: "2 days ago",
    url: "https://abderrahmanebouzemlal.github.io/pomodoro-timer-app/",
    github: "https://github.com/AbderrahmaneBouzemlal/pomodoro-timer-app",
    tech: ["Svelte", "Tailwind CSS", "javascript", "vite"],
    featured: false
  },
  {
    id: 2,
    name: "fylo landing page",
    description: "A responsive landing page for a fictional cloud storage service, designed with Tailwind CSS.",
    category: "landing page",
    image: `${basePath}fyle-preview.jpg`,
    lastUpdated: "1 week ago",
    url: "https://abderrahmanebouzemlal.github.io/fylo-landing-page/",
    github: "https://github.com/abderrahmaneBouzemlal/fylo-landing-page",
    tech: ["HTML", "Tailwind CSS", "JavaScript"],
    featured: false
  },
  {
    id: 3,
    name: "blog post design",
    description: "A sleek and modern blog post layout with a focus on readability, created using Tailwind CSS.",
    category: "blog",
    image: `${basePath}blog-preview.jpg`,
    url: "https://abderrahmanebouzemlal.github.io/blog-card/",
    github: "https://github.com/AbderrahmaneBouzemlal/blog-card/",
    tech: ["HTML", "Tailwind CSS", "JavaScript"],
    lastupadted: "3 weeks ago",
    featured: false
  },
  {
    id: 4,
    lastUpdated: "3 days ago",
    name: "digital bank landing page",
    description: "A clean and professional landing page for a digital banking service, built with Tailwind CSS.",
    category: "landing page",
    image: `${basePath}digitalbank-preview.jpg`,
    url: "https://digitalbank-landing-page-orcin.vercel.app/",
    tech: ["Svelte", "Tailwind CSS", "JavaScript"],
    featured: true,
    github: "https://github.com/AbderrahmaneBouzemlal/digitalbank-landing-page",
  },
  {
    id: 5,
    name: "testimonials grid",
    description: "A testimonial section featuring user reviews in a responsive grid layout, styled with Tailwind CSS.",
    category: "grid",
    image: `${basePath}testimonials-preview.jpg`,
    lastUpdated: "1 day ago",
    url: "https://abderrahmanebouzemlal.github.io/testimonials-grid-section-main/",
    github: "https://github.com/AbderrahmaneBouzemlal/testimonials-grid-section-main",
    tech: ["SvelteKit", "Tailwind CSS", "MDSvex"],
    featured: true
  },
  {
    id: 6,
    name: "Job Listing Interface",
    description: "A job listing interface with dynamic filtering options, built using Svelte and Tailwind CSS.",
    category: "job listings",
    image: `${basePath}joblisting-preview.jpg`,
    url: "https://abderrahmaneBouzemlal.github.io/Job-Listing-Interface/",
    github: "https://github.com/AbderrahmaneBouzemlal/Job-Listing-Interface",
    lastUpdated: "4 days ago",
    tech: ["Svelte", "Tailwind CSS", "D3.js", "PostgreSQL"],
    featured: true
  },
]