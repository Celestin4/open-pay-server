"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_controller_1 = require("./user.controller");
const user_1 = require("../../../enums/user");
const route = express_1.default.Router();
route.get('/my-profile', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.LOAN_OFFICER, user_1.ENUM_USER_ROLE.CUSTOMER_SERVICE_REPRESENTATIVE), user_controller_1.UserController.getMyProfile);
route.patch('/update-my-profile', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.LOAN_OFFICER, user_1.ENUM_USER_ROLE.CUSTOMER_SERVICE_REPRESENTATIVE), user_controller_1.UserController.updateMyProfile);
exports.UserRoutes = route;
