const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const generateTasks = () => {
  const titles = [
    'Fix login authentication bug',
    'Implement user dashboard',
    'Design landing page mockups',
    'Write API documentation',
    'Review pull request #456',
    'Update database schema',
    'Optimize image loading',
    'Setup CI/CD pipeline',
    'Create unit tests for auth module',
    'Refactor payment gateway integration',
    'Add email notification feature',
    'Migrate to latest Node version',
    'Improve search functionality',
    'Design mobile app wireframes',
    'Conduct user research interviews',
    'Fix responsive layout issues',
    'Integrate third-party analytics',
    'Setup error monitoring',
    'Create onboarding tutorial',
    'Optimize database queries',
    'Implement two-factor authentication',
    'Update privacy policy page',
    'Design new logo concepts',
    'Setup staging environment',
    'Write blog post about new features',
    'Prepare quarterly presentation',
    'Review security vulnerabilities',
    'Update npm dependencies',
    'Create admin panel interface',
    'Implement dark mode theme',
    'Setup automated backups',
    'Conduct code review session',
    'Design email templates',
    'Optimize bundle size',
    'Setup load balancer',
    'Create API rate limiting',
    'Implement caching strategy',
    'Update user documentation',
    'Setup monitoring dashboard',
    'Refactor legacy code modules',
    'Design notification system',
    'Implement file upload feature',
    'Create data export functionality',
    'Setup Redis for session storage',
    'Design settings page UI',
    'Implement search filters',
    'Create backup restore procedure',
    'Setup SSL certificates',
    'Design 404 error page',
    'Implement pagination for lists'
  ];

  const descriptions = [
    'Need to investigate and fix the root cause of this issue',
    'Should include all necessary components and be responsive',
    'Consider user feedback and current design trends',
    'Ensure comprehensive coverage of all endpoints',
    'Priority task that needs immediate attention',
    'Follow best practices and maintain backward compatibility',
    'This will improve overall application performance',
    'Setup proper testing and deployment workflows',
    'Include edge cases and error scenarios',
    'Coordinate with the backend team for implementation',
    'Make sure to handle all possible scenarios',
    'Document any breaking changes thoroughly',
    'Consider performance implications of changes',
    'Get approval from stakeholders before proceeding',
    'Allocate sufficient time for thorough testing'
  ];

  const statuses = ['todo', 'in_progress', 'review', 'completed', 'cancelled'];
  const priorities = ['low', 'medium', 'high', 'urgent'];
  const recurrenceTypes = ['daily', 'weekly', 'monthly', 'yearly'];

  const tasks = [];
  const now = new Date();

  for (let i = 0; i < 50; i++) {
    const status = getRandomElement(statuses);
    const priority = getRandomElement(priorities);
    const startDate = addDays(now, getRandomInt(-10, 5));
    const dueDate = addDays(startDate, getRandomInt(1, 30));

    const task = {
      title: getRandomElement(titles),
      description: getRandomElement(descriptions),
      status,
      priority,
      startDate,
      dueDate,
      estimatedTime: getRandomInt(30, 480)
    };

    if (status === 'completed') {
      task.actualTime = getRandomInt(30, 600);
      task.completedAt = addDays(startDate, getRandomInt(1, 20));
    }

    if (Math.random() < 0.2) {
      task.recurrence = {
        type: getRandomElement(recurrenceTypes),
        interval: getRandomInt(1, 4),
        endDate: addDays(dueDate, getRandomInt(30, 180))
      };
    }
    if (Math.random() < 0.1) {
      task.isDeleted = true;
    }

    tasks.push(task);
  }

  return tasks;
};
