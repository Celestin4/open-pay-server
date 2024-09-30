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
exports.AuthServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const generateAccountNumber_1 = require("../../../helpers/generateAccountNumber");
const client_1 = require("@prisma/client");
const userSignUp = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check for existing phone number and national ID
    const userPhoneAlreadyExist = yield prisma_1.default.user.findFirst({
        where: { phoneNumber: payload.phoneNumber },
    });
    if (userPhoneAlreadyExist) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Phone Number Already Exist');
    }
    const userNationalIdAlreadyExist = yield prisma_1.default.user.findFirst({
        where: { nationalId: payload.nationalId },
    });
    if (userNationalIdAlreadyExist) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'National ID Already Exist');
    }
    // Hash the password and pin
    const hashPassword = yield bcrypt_1.default.hash(payload.password, Number(config_1.default.bycrypt_salt_rounds));
    const hashPin = yield bcrypt_1.default.hash(payload.pin, Number(config_1.default.bycrypt_salt_rounds));
    payload.password = hashPassword;
    payload.pin = hashPin;
    try {
        // Create user and associated data in a transaction
        const user = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Create the user
            const newUser = yield tx.user.create({
                data: Object.assign({ role: client_1.UserRole.user }, payload),
            });
            // Create related entities (personal info, device info, financial info)
            try {
                console.log('Creating personal info...');
                yield tx.personalInfo.create({
                    data: {
                        userId: newUser.id,
                    },
                });
            }
            catch (error) {
                console.warn('Error creating personal info:', error);
                throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to create personal info');
            }
            // try {
            //   console.log('Creating device info...');
            //   await tx.deviceInfo.create({
            //     data: {
            //       userId: newUser.id,
            //     },
            //   });
            // } catch (error) {
            //   console.warn('Error creating device info:', error);
            //   throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create device info');
            // }
            try {
                console.log('Creating financial info...');
                yield tx.userFinancialInfo.create({
                    data: {
                        accountNumber: (0, generateAccountNumber_1.generateAccountNumber)(newUser.phoneNumber),
                        user: {
                            connect: {
                                id: newUser.id,
                            },
                        },
                    },
                });
            }
            catch (error) {
                console.warn('Error creating financial info:', error);
                throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to create financial info');
            }
            return newUser;
        }));
        // Generate access token
        const accessToken = jwtHelpers_1.jwtHelpers.createToken({ userId: user.id, role: user.role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
        return accessToken;
    }
    catch (error) {
        console.error('Transaction Error:', error);
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Transaction failed');
    }
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            phoneNumber: payload.phoneNumber,
        },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User or Password Not Matching');
    }
    const isPasswordMatch = yield bcrypt_1.default.compare(payload.password, isUserExist.password);
    if (!isPasswordMatch) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'User or Password Not Matching');
    }
    const userId = isUserExist.id;
    const role = isUserExist.role;
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ userId, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return accessToken;
});
exports.AuthServices = {
    userSignUp,
    loginUser,
};
