import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import routes from './app/routes';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import http from 'http';
import { Server } from 'socket.io';

const app: Application = express();
app.use(cookieParser());

// Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

// Configure CORS to allow requests from a specific origin and allow credentials
app.use(
  cors({
    origin: 'http://localhost:3000', // Front-end URL
    credentials: true, // Allow cookies, authorization headers, etc. to be sent
  })
);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Same origin for WebSocket connections
    credentials: true,
  },
});

// Middleware to make the Socket.IO instance accessible in routes
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.io = io;
  next();
});

// API routes
app.use('/api/v1', routes);

// Attach the Socket.IO instance to the Express app
app.set('socketio', io);

// Global error handler
app.use(globalErrorHandler);

// Handle 404 Not Found errors
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.url,
        message: 'API Not Found',
      },
    ],
  });
  next();
});

export default server; // Export the 'server' instance
