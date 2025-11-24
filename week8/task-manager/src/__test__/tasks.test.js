import request from 'supertest';
import express from 'express';
import router from '../routes/tasksRoutes.js';

jest.mock('../models/connect.js', () => {
  const mockTask = jest.fn();
  mockTask.find = jest.fn();
  mockTask.findById = jest.fn();
  mockTask.findByIdAndUpdate = jest.fn();
  mockTask.findByIdAndDelete = jest.fn();

  return {
    Task: mockTask
  };
});
import { Task } from '../models/connect.js';

const app = express();
app.use(express.json());
app.use('/tasks', router);

describe('Tasks API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /tasks', () => {
    it('should return all tasks sorted by dueDate', async () => {
      const mockTasks = [
        { _id: '1', title: 'Task 1', dueDate: new Date('2023-12-01') },
        { _id: '2', title: 'Task 2', dueDate: new Date('2023-12-02') }
      ];

      Task.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockTasks)
        })
      });

      const response = await request(app).get('/tasks').expect(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]._id).toBe('1');
      expect(response.body[0].title).toBe('Task 1');
      expect(new Date(response.body[0].dueDate).toISOString()).toBe(
        '2023-12-01T00:00:00.000Z'
      );
      expect(response.body[1]._id).toBe('2');
      expect(response.body[1].title).toBe('Task 2');
      expect(new Date(response.body[1].dueDate).toISOString()).toBe(
        '2023-12-02T00:00:00.000Z'
      );

      expect(Task.find).toHaveBeenCalledWith({});
    });

    it('should handle errors when fetching tasks', async () => {
      Task.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue(new Error('Database error'))
        })
      });

      const response = await request(app).get('/tasks').expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /tasks', () => {
    it('should create a new task', async () => {
      const newTask = {
        title: 'New Task',
        description: 'Task description',
        dueDate: '2026-12-31'
      };

      const mockTaskInstance = {
        save: jest.fn().mockResolvedValue(newTask)
      };

      Task.mockImplementation(() => mockTaskInstance);

      const response = await request(app).post('/tasks').send(newTask);
      console.log(response.body);

      expect(response.body).toEqual(newTask);
      expect(mockTaskInstance.save).toHaveBeenCalled();
    });

    it('should handle validation errors when creating task', async () => {
      const invalidTask = { title: '' };

      const mockSave = jest
        .fn()
        .mockRejectedValue(new Error('Validation failed'));
      const MockTaskConstructor = jest.fn().mockImplementation(() => ({
        save: mockSave
      }));

      jest.doMock('../models/connect.js', () => ({
        Task: MockTaskConstructor
      }));

      const { default: refreshedRouter } = await import(
        '../routes/tasksRoutes.js'
      );
      const testApp = express();
      testApp.use(express.json());
      testApp.use('/tasks', refreshedRouter);

      const response = await request(testApp)
        .post('/tasks')
        .send(invalidTask)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /tasks/:id', () => {
    it('should return a task by ID', async () => {
      const mockTask = {
        _id: '123',
        title: 'Test Task',
        description: 'Test Description'
      };

      Task.findById.mockResolvedValue(mockTask);

      const response = await request(app).get('/tasks/123').expect(200);

      expect(response.body).toEqual(mockTask);
      expect(Task.findById).toHaveBeenCalledWith('123');
    });

    it('should return 404 when task not found', async () => {
      Task.findById.mockResolvedValue(null);

      const response = await request(app).get('/tasks/999').expect(404);

      expect(response.body).toEqual({ error: 'task not found' });
    });

    it('should handle errors when fetching task by ID', async () => {
      Task.findById.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/tasks/123').expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PATCH /tasks/:id', () => {
    it('should update a task', async () => {
      const updatedTask = {
        _id: '123',
        title: 'Updated Task',
        description: 'Updated Description'
      };

      Task.findByIdAndUpdate.mockResolvedValue(updatedTask);

      const response = await request(app)
        .patch('/tasks/123')
        .send({ title: 'Updated Task' })
        .expect(200);

      expect(response.body).toEqual(updatedTask);
      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        { $set: { title: 'Updated Task' } },
        { new: true }
      );
    });

    it('should return 404 when updating non-existent task', async () => {
      Task.findByIdAndUpdate.mockResolvedValue(null);

      const response = await request(app)
        .patch('/tasks/999')
        .send({ title: 'Updated Task' })
        .expect(404);

      expect(response.body).toEqual({ error: 'Task not found' });
    });

    it('should handle errors when updating task', async () => {
      Task.findByIdAndUpdate.mockRejectedValue(new Error('Update failed'));

      const response = await request(app)
        .patch('/tasks/123')
        .send({ title: 'Updated Task' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task', async () => {
      const deletedTask = { _id: '123', title: 'Task to delete' };
      Task.findByIdAndDelete.mockResolvedValue(deletedTask);

      const response = await request(app).delete('/tasks/123').expect(200);

      expect(response.body).toEqual({ message: 'Task deleted' });
      expect(Task.findByIdAndDelete).toHaveBeenCalledWith('123');
    });

    it('should return 404 when deleting non-existent task', async () => {
      Task.findByIdAndDelete.mockResolvedValue(null);

      const response = await request(app).delete('/tasks/999').expect(404);

      expect(response.body).toEqual({ error: 'Task not found' });
    });

    it('should handle errors when deleting task', async () => {
      Task.findByIdAndDelete.mockRejectedValue(new Error('Delete failed'));

      const response = await request(app).delete('/tasks/123').expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });
});
