import { Todo } from './db.js';
import { Router } from 'express';

const router = Router();

router.get('', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ position: 1});
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('', async (req, res) => {
  try {
    const todo = new Todo({
      text: req.body.text,
    });
    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/:id/reorder', async (req, res) => {
  try {
    const { newPosition } = req.body;
    const todoId = req.params.id;
    
    const todo = await Todo.findById(todoId);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    const oldPosition = todo.position;
    
    if (newPosition > oldPosition) {
      await Todo.updateMany(
        { 
          position: { $gt: oldPosition, $lte: newPosition },
          _id: { $ne: todoId }
        },
        { $inc: { position: -1 } }
      );
    } else if (newPosition < oldPosition) {
      await Todo.updateMany(
        { 
          position: { $gte: newPosition, $lt: oldPosition },
          _id: { $ne: todoId }
        },
        { $inc: { position: 1 } }
      );
    }
    
    todo.position = newPosition;
    await todo.save();
    
    res.json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Delete todo
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
    if (!todo) {
        return res.status(404).json({error: 'todo not found'});
    } 
    res.json(todo);
    } catch {
        res.status(400).json({error: error.message});
    }
});

export default router
