import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import todoRouter from './routes.js'

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/api/todos', todoRouter);

export default app;
