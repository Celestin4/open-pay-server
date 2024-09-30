"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const admin_services_1 = require("./admin.services");
const createEmployees = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(http_status_1.default.UNAUTHORIZED).json({
            success: false,
            message: 'Authorization token is missing',
        });
    }
    const authToken = authHeader.split(' ')[1];
    if (!authToken) {
        return res.status(http_status_1.default.UNAUTHORIZED).json({
            success: false,
            message: 'Token is missing',
        });
    }
    const payload = req.body;
    const result = yield admin_services_1.AdminServices.createEmployees(authToken, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Employee created successfully',
        data: result,
    });
}));
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(http_status_1.default.UNAUTHORIZED).json({
            success: false,
            message: 'Authorization token is missing',
        });
    }
    const authToken = authHeader.split(' ')[1];
    if (!authToken) {
        return res.status(http_status_1.default.UNAUTHORIZED).json({
            success: false,
            message: 'Token is missing',
        });
    }
    const result = yield admin_services_1.AdminServices.getAllUsers(authToken);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All Users Retried',
        data: result,
    });
}));
const getAllEmployees = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(http_status_1.default.UNAUTHORIZED).json({
            success: false,
            message: 'Authorization token is missing',
        });
    }
    const authToken = authHeader.split(' ')[1];
    if (!authToken) {
        return res.status(http_status_1.default.UNAUTHORIZED).json({
            success: false,
            message: 'Token is missing',
        });
    }
    const result = yield admin_services_1.AdminServices.getAllEmployees(authToken);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All Users data retried',
        data: result,
    });
}));
const getSingleUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(http_status_1.default.UNAUTHORIZED).json({
            success: false,
            message: 'Authorization token is missing',
        });
    }
    const authToken = authHeader.split(' ')[1];
    if (!authToken) {
        return res.status(http_status_1.default.UNAUTHORIZED).json({
            success: false,
            message: 'Token is missing',
        });
    }
    const { id } = req.params;
    const result = yield admin_services_1.AdminServices.getSingleUser(authToken, id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User data retried',
        data: result,
    });
}));
const getAllTransactions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(http_status_1.default.UNAUTHORIZED).json({
            success: false,
            message: 'Authorization token is missing',
        });
    }
    const authToken = authHeader.split(' ')[1];
    if (!authToken) {
        return res.status(http_status_1.default.UNAUTHORIZED).json({
            success: false,
            message: 'Token is missing',
        });
    }
    const result = yield admin_services_1.AdminServices.getAllTransactions(authToken);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All transactions retrieve',
        data: result,
    });
}));
exports.AdminController = {
    createEmployees,
    getAllUsers,
    getAllEmployees,
    getSingleUser,
    getAllTransactions
};
