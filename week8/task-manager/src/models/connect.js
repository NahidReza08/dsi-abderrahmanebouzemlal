import mongoose from 'mongoose';

mongoose
  .connect('mongodb://localhost:27017/taskManager')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const task = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    status: {
      type: String,
      enum: {
        values: ['todo', 'in_progress', 'review', 'completed', 'cancelled'],
        message: '{VALUE} is not a valid status'
      },
      default: 'todo'
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'urgent'],
        message: '{VALUE} is not a valid priority'
      },
      default: 'medium'
    },
    dueDate: { type: Date },
    startDate: { type: Date },
    estimatedTime: {
      type: Number,
      min: [0, 'Estimated time cannot be negative'],
      max: [10080, 'Estimated time cannot exceed 1 week (10080 minutes)']
    },
    actualTime: {
      type: Number,
      min: [0, 'Actual time cannot be negative'],
      validate: {
        validator: function (value) {
          if (value > 0 && this.status !== 'completed') {
            return false;
          }
          return true;
        },
        message: 'Actual time can only be set for completed tasks'
      }
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'project' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    recurrence: {
      type: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly']
      },
      interval: {
        type: Number,
        min: 1,
        max: 365
      },
      endDate: Date
    },
    completedAt: Date,
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const Task = mongoose.model('task', task);
