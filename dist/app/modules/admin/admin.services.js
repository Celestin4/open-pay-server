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
exports.AdminServices = void 0;
/* eslint-disable @typescript-eslint/ban-ts-comment */
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const generateEmployeeId_1 = require("../../../helpers/generateEmployeeId");
const userHelpers_1 = require("../../../helpers/userHelpers");
const client_1 = require("@prisma/client");
const excludingfields_1 = __importDefault(require("../../../helpers/excludingfields"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const createEmployees = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyDecodedUser = yield userHelpers_1.UserHelpers.verifyDecodedUser(token);
    if ((verifyDecodedUser === null || verifyDecodedUser === void 0 ? void 0 : verifyDecodedUser.role) !== client_1.UserRole.admin) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized to perform this action');
    }
    const employeeId = (0, generateEmployeeId_1.generateEmployeeId)('EMP_LO');
    yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const userInfo = yield tx.user.create({
            data: {
                role: payload.role,
                isEmployee: true,
                firstName: payload.firstName,
                lastName: payload.lastName,
                nationalId: payload.nationalId,
                phoneNumber: payload.phoneNumber,
                password: payload.password,
                pin: payload.pin,
            },
        });
        yield tx.personalInfo.create({
            data: {
                userId: userInfo.id,
                gender: payload.gender,
                dateOfBirth: payload.dateOfBirth,
                maritalStatus: payload.maritalStatus,
                currentAddress: payload.currentAddress,
                permanentAddress: payload.permanentAddress,
                nationality: payload.nationality,
                email: payload.email,
            },
        });
        yield tx.loanOfficer.create({
            data: {
                userId: userInfo.id,
                department: payload.department,
                hireDate: payload.hireDate,
                employeeId: employeeId,
            },
        });
    }));
});
const getAllUsers = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyDecodedUser = yield userHelpers_1.UserHelpers.verifyDecodedUser(token);
    if ((verifyDecodedUser === null || verifyDecodedUser === void 0 ? void 0 : verifyDecodedUser.role) !== client_1.UserRole.admin) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized to perform this action');
    }
    const users = yield prisma_1.default.user.findMany({
        where: {
            isEmployee: false,
            role: client_1.UserRole.user,
        },
    });
    const keysToExclude = ['password', 'pin'];
    const updatedResult = (0, excludingfields_1.default)(users, keysToExclude);
    return updatedResult;
});
const getAllEmployees = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyDecodedUser = yield userHelpers_1.UserHelpers.verifyDecodedUser(token);
    if ((verifyDecodedUser === null || verifyDecodedUser === void 0 ? void 0 : verifyDecodedUser.role) !== client_1.UserRole.admin) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized to perform this action');
    }
    const users = yield prisma_1.default.user.findMany({
        where: {
            isEmployee: true,
            role: {
                in: [client_1.UserRole.loan_officer, client_1.UserRole.customer_service_representative],
            },
        },
    });
    const keysToExclude = ['password', 'pin'];
    const updatedResult = (0, excludingfields_1.default)(users, keysToExclude);
    return updatedResult;
});
const getSingleUser = (token, id) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyDecodedUser = yield userHelpers_1.UserHelpers.verifyDecodedUser(token);
    if ((verifyDecodedUser === null || verifyDecodedUser === void 0 ? void 0 : verifyDecodedUser.role) !== client_1.UserRole.admin) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized to perform this action');
    }
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const keysToExclude = ['password', 'pin'];
    const updatedResult = (0, excludingfields_1.default)(user, keysToExclude);
    return updatedResult;
});
const getAllTransactions = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyDecodedUser = yield userHelpers_1.UserHelpers.verifyDecodedUser(token);
    if ((verifyDecodedUser === null || verifyDecodedUser === void 0 ? void 0 : verifyDecodedUser.role) !== client_1.UserRole.admin) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized to perform this action');
    }
    const result = yield prisma_1.default.transaction.findMany({
        include: {
            deposit: true,
            withdrawal: true,
            transfer: true,
        },
    });
    return result;
});
exports.AdminServices = {
    createEmployees,
    getAllUsers,
    getAllEmployees,
    getSingleUser,
    getAllTransactions,
};
