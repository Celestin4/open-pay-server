"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const routes_1 = __importDefault(require("./app/routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
// Parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const server = http_1.default.createServer(app);
// Configure CORS to allow requests from a specific origin and allow credentials
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000', // Front-end URL
    credentials: true, // Allow cookies, authorization headers, etc. to be sent
}));
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Same origin for WebSocket connections
        credentials: true,
    },
});
// Middleware to make the Socket.IO instance accessible in routes
app.use((req, res, next) => {
    res.locals.io = io;
    next();
});
// API routes
app.use('/api/v1', routes_1.default);
// Attach the Socket.IO instance to the Express app
app.set('socketio', io);
// Global error handler
app.use(globalErrorHandler_1.default);
// Handle 404 Not Found errors
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
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
exports.default = server; // Export the 'server' instance
