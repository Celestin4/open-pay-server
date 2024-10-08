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
exports.transferValidityCheck = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const transferValidityCheck = (token, amount) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Unauthorized access');
    }
    const verifyToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    const decodedUserInfo = yield prisma_1.default.user.findUnique({
        where: {
            id: verifyToken === null || verifyToken === void 0 ? void 0 : verifyToken.userId,
        },
        include: {
            userFinancialInfo: true,
        },
    });
    if (!decodedUserInfo) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Unauthorized');
    }
    if (amount < 0) {
        throw new ApiError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Amount can't be Negative");
    }
    return decodedUserInfo;
});
exports.transferValidityCheck = transferValidityCheck;
