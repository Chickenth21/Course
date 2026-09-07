import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import healthRouter from './routes/health.route.js';
import dbRouter from './routes/db.route.js';
import authRouter from './routes/auth.route.js';
import assessmentRouter from './routes/assessment.route.js';
import courseRouter from './routes/course.route.js';
import lessonRouter from './routes/lesson.route.js';
import exerciseRouter from './routes/exercise.route.js';
import learningPathRouter from './routes/learningPath.route.js';
import logRouter from './routes/log.route.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

// Middlewares
app.use(
  cors({
    origin: [config.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base API Routes
app.use('/api/health', healthRouter);
app.use('/api/db', dbRouter);
app.use('/api/auth', authRouter);
app.use('/api/assessments', assessmentRouter);
app.use('/api/courses', courseRouter);
app.use('/api/lessons', lessonRouter);
app.use('/api/exercises', exerciseRouter);
app.use('/api/learning-path', learningPathRouter);
app.use('/api/logs', logRouter);

// 404 Handler
app.use('*', (_req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'API Route not found'
  });
});

// Central Error Handler
app.use(errorHandler);

export default app;
