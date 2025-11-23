import request from 'supertest';
import express from 'express';
import router from '../routes/tasksRoutes.js';

jest.mock('../models/connect.js', () => {
  const mockSave = jest.fn();

  const MockTask = jest.fn().mockImplementation(function (data) {
    return {
      ...data,
      save: mockSave
    };
  });

  MockTask.find = jest.fn();
  MockTask.findById = jest.fn();
  MockTask.findByIdAndUpdate = jest.fn();
  MockTask.findByIdAndDelete = jest.fn();

  MockTask.mockSave = mockSave;

  return {
    Task: MockTask
  };
});
import { Task } from '../models/connect.js';

const app = express();
app.use(express.json());
app.use('/tasks', router);

describe('Task Validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /tasks - Validation', () => {
    it('should return 400 when title is missing', async () => {
      const invalidTask = {
        description: 'Task description',
        dueDate: '2023-12-31'
      };

      const response = await request(app)
        .post('/tasks')
        .send(invalidTask)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      const fields = response.body.details.map((item) => item.field);
      expect(fields).toContain('title');
    });

    it('should return 400 when title is empty', async () => {
      const invalidTask = {
        title: '',
        description: 'Task description',
        dueDate: '2023-12-31'
      };

      const response = await request(app)
        .post('/tasks')
        .send(invalidTask)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      const fields = response.body.details.map((item) => item.field);

      expect(fields).toContain('title');
    });

    it('should return 400 when title is too long', async () => {
      const invalidTask = {
        title: 'A'.repeat(256),
        description: 'Task description',
        dueDate: '2023-12-31'
      };

      const response = await request(app)
        .post('/tasks')
        .send(invalidTask)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      const fields = response.body.details.map((item) => item.field);

      expect(fields).toContain('title');
    });

    it('should return 400 when dueDate is invalid', async () => {
      const invalidTask = {
        title: 'Valid Task',
        description: 'Task description',
        dueDate: 'invalid-date'
      };

      const response = await request(app)
        .post('/tasks')
        .send(invalidTask)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      const fields = response.body.details.map((item) => item.field);

      expect(fields).toContain('dueDate');
    });

    it('should return 400 when dueDate is in the past', async () => {
      const invalidTask = {
        title: 'Valid Task',
        description: 'Task description',
        dueDate: '2020-01-01'
      };

      const response = await request(app)
        .post('/tasks')
        .send(invalidTask)
        .expect(400);

      expect(response.body).toHaveProperty('error');

      const fields = response.body.details.map((item) => item.field);
      expect(fields).toContain('dueDate');
    });

    it('should accept valid task data', async () => {
      const validTask = {
        title: 'Valid Task',
        description: 'Valid description',
        dueDate: new Date('2026-12-31'),
        priority: 'high',
        status: 'todo'
      };
      const savedTask = { ...validTask, _id: '123' };

      Task.mockSave.mockResolvedValue(savedTask);

      const response = await request(app).post('/tasks').send(validTask);
      expect(response.body.title).toEqual(validTask.title);
      expect(new Date(response.body.dueDate).toISOString()).toBe(
        '2026-12-31T00:00:00.000Z'
      );
      expect(Task).toHaveBeenCalledWith(validTask);
      expect(Task.mockSave).toHaveBeenCalled();
    });

    it('should accept task with only required fields', async () => {
      const validTask = {
        title: 'Valid Task',
        dueDate: new Date('2026-12-31'),
        priority: 'high',
        status: 'todo'
      };
      const savedTask = { ...validTask, _id: '123' };

      Task.mockSave.mockResolvedValue(savedTask);

      const response = await request(app)
        .post('/tasks')
        .send(validTask)
        .expect(201);

      expect(response.body.title).toEqual(validTask.title);
      expect(new Date(response.body.dueDate).toISOString()).toBe(
        '2026-12-31T00:00:00.000Z'
      );
      expect(Task).toHaveBeenCalledWith(validTask);
    });
  });

  describe('PATCH /tasks/:id - Validation', () => {
    const testId = '507f1f77bcf86cd799439011';

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return 400 when updating with empty title', async () => {
      const invalidUpdate = {
        title: ''
      };

      Task.findByIdAndUpdate.mockRejectedValue(
        new Error('Validation failed: title: Path `title` is required.')
      );

      const response = await request(app)
        .patch(`/tasks/${testId}`)
        .send(invalidUpdate)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('title');
    });

    it('should return 400 when updating with invalid dueDate', async () => {
      const invalidUpdate = {
        dueDate: 'invalid-date'
      };

      Task.findByIdAndUpdate.mockRejectedValue(
        new Error('Validation failed: dueDate: Cast to date failed')
      );

      const response = await request(app)
        .patch(`/tasks/${testId}`)
        .send(invalidUpdate)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('dueDate');
    });

    it('should return 400 when updating with too long description', async () => {
      const invalidUpdate = {
        description: 'A'.repeat(1001)
      };

      Task.findByIdAndUpdate.mockRejectedValue(
        new Error(
          'Validation failed: description: Path `description` exceeds maximum length'
        )
      );

      const response = await request(app)
        .patch(`/tasks/${testId}`)
        .send(invalidUpdate)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('description');
    });

    it('should accept valid partial updates', async () => {
      const validUpdate = {
        title: 'Updated Title'
      };

      const updatedTask = {
        _id: testId,
        title: 'Updated Title',
        dueDate: '2026-12-31T00:00:00.000Z',
        priority: 'high',
        status: 'todo'
      };

      Task.findByIdAndUpdate.mockResolvedValue(updatedTask);

      const response = await request(app)
        .patch(`/tasks/${testId}`)
        .send(validUpdate)
        .expect(200);

      expect(response.body).toEqual(updatedTask);
      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
        testId,
        { $set: validUpdate },
        { new: true }
      );
    });
  });
});
