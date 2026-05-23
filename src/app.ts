// Apply @prisma/client monkey patches FIRST before any module imports the client
import './config/prisma';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { NotFoundError } from './utils/apiResponse';
import apiRouter from './routes/index';

const app = express();

// 1. Core Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Custom HTTP request logger middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`Incoming Request: ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  next();
});

// 3. Register API routes under /api/v1
app.use('/api/v1', apiRouter);

// 4. Handle 404 - Not Found Routes
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(`Đường dẫn API [${req.method} ${req.originalUrl}] không tồn tại.`));
});

// 5. Global centralized error handler middleware
app.use(errorHandler);

export default app;
