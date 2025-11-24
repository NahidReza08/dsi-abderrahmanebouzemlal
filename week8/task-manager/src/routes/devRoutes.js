import { Router } from 'express';
import { Task } from '../models/connect.js';
import { generateTasks } from '../seed.js';

const router = Router();

router.get('/seed', async (req, res) => {
  try {
    await Task.deleteMany({});

    const tasks = generateTasks();

    const inserted = await Task.insertMany(tasks);

    const stats = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityStats = await Task.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      priorityDistribution: priorityStats,
      stats,
      totalTasks: inserted.length
    });
  } catch (error) {
    res.status(400).json({ error: error });
  } finally {
    res.status(200).end();
  }
});

export default router;
