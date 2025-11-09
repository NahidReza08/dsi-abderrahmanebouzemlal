import express from 'express';
import tasksRoutes from './routes/tasksRoutes.js';
import devRoutes from './routes/devRoutes.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import { errorHandler } from './middlewares/error.js';
import { notFound } from '@hapi/boom';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Taks manager API'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api', devRoutes);

app.use(notFound);

app.use(errorHandler);

export default app;
