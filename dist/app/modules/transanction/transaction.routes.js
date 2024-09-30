"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const transaction_controller_1 = require("./transaction.controller");
const route = express_1.default.Router();
route.get('/get-my-statements', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER), transaction_controller_1.TransactionController.getMyStatements);
route.post('/deposit-money', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER), transaction_controller_1.TransactionController.depositMoney);
route.post('/withdraw-money', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER), transaction_controller_1.TransactionController.withdrawMoney);
route.post('/transfer-money', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER), transaction_controller_1.TransactionController.transferMoney);
route.post('/mobile-recharge', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER), transaction_controller_1.TransactionController.mobileRecharge);
exports.TransactionRoutes = route;
