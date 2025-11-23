import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import postRoutes from './routes/postRoutes.js';
import categoriesRoutes from "./routes/categoriesRoutes.js";
import tagRoutes from "./routes/tagsRoutes.js";
import path from 'node:path';
// import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/health', (req, res) => {
	res.status(200).json({
		status: 'OK',
		timestamp: new Date().toISOString(),
		service: 'La Plume Blog API'
	});
});

app.use('/api/posts', postRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/tags', tagRoutes);

//
// app.use(notFound);
//
// app.use(errorHandler);

export default app;
