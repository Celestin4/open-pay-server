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
exports.TransactionController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const transaction_services_1 = require("./transaction.services");
const depositMoney = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield transaction_services_1.TransactionServices.depositMoney(authToken, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Money received successful',
        data: result,
    });
}));
const withdrawMoney = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield transaction_services_1.TransactionServices.withdrawMoney(authToken, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Withdraw Money successful',
        data: result,
    });
}));
const transferMoney = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield transaction_services_1.TransactionServices.transferMoney(authToken, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Transfer money successful',
        data: result,
    });
}));
const mobileRecharge = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield transaction_services_1.TransactionServices.mobileRecharge(authToken, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Mobile recharge successful',
        data: result,
    });
}));
const getMyStatements = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield transaction_services_1.TransactionServices.getMyStatements(authToken);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Statements retrieve',
        data: result,
    });
}));
exports.TransactionController = {
    depositMoney,
    withdrawMoney,
    transferMoney,
    mobileRecharge,
    getMyStatements
};
