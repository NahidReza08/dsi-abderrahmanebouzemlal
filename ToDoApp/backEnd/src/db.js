import mongoose from "mongoose";

mongoose
  .connect('mongodb://localhost:27017/todoapp')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  position: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Auto-increment position before saving
todoSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const lastTodo = await mongoose.model('Todo')
        .findOne()
        .sort({ position: 1 })
        .select('position');

      this.position = lastTodo ? lastTodo.position + 1 : 0;
    } catch (error) {
      return next(error);
    }
  }
  
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  
  next();
});


export const Todo = mongoose.model('Todo', todoSchema);