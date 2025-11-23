import { Router } from 'express';
import { Task } from '../models/connect.js';
import { validateCreateTask } from '../middlewares/validate.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const user = req.user.id;
    const tasks = await Task.find({ createdBy: user, isDeleted: false })
      .sort({ dueDate: 1 })
      .exec();
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/', validateCreateTask, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      createdBy: req.user.id
    });
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    let task = await Task.findById(req.params.id, { isDeleted: false });
    if (!task || task.createdBy != req.user.id) {
      return res.status(404).json({ error: 'Task not found' });
    }
    task = await task.updateOne(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task || task.createdBy != req.user.id) {
      return res.status(404).json({ error: 'Task not found' });
    }
    task.isDeleted = true;
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id, { isDeleted: false });
    if (!task || task.createdBy != req.user.id) {
      return res.status(404).json({ error: 'task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
