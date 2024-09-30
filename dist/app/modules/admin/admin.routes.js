"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("./admin.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const route = express_1.default.Router();
route.post('/create-employees', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), admin_controller_1.AdminController.createEmployees);
route.get('/get-all-users', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), admin_controller_1.AdminController.getAllUsers);
route.get('/get-all-employees', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), admin_controller_1.AdminController.getAllEmployees);
route.get('/get-single-user/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), admin_controller_1.AdminController.getSingleUser);
route.get('/all-transactions', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), admin_controller_1.AdminController.getAllTransactions);
exports.AdminRoutes = route;
