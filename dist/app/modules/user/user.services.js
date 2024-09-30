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
exports.UserServices = void 0;
const config_1 = __importDefault(require("../../../config"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const excludingfields_1 = __importDefault(require("../../../helpers/excludingfields"));
const getMyProfile = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Unauthorized access');
    }
    let verifyToken;
    try {
        verifyToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid token');
    }
    const decodedUserInfo = yield prisma_1.default.user.findUnique({
        where: {
            id: verifyToken.userId,
        },
        include: {
            userFinancialInfo: true,
            personalInfo: true,
            deviceInfo: true,
        },
    });
    if (!decodedUserInfo) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User Not Exist');
    }
    const keysToExclude = ['password', 'pin'];
    const updatedResult = (0, excludingfields_1.default)(decodedUserInfo, keysToExclude);
    return updatedResult;
});
// const updateMyProfile = async (
//   token: string | undefined,
//   payload: Partial<User>,
// ): Promise<Partial<User> | undefined> => {
//   if (!token) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
//   }
//   let verifyToken;
//   try {
//     verifyToken = jwtHelpers.verifyToken(token as string, config.jwt.secret as Secret);
//   } catch (error) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
//   }
//   const decodedUserInfo = await prisma.user.findUnique({
//     where: {
//       id: verifyToken.userId, 
//     },
//   });
//   if (!decodedUserInfo) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User Not Exist');
//   }
//   // const result = await prisma.user.update({
//   //   where: {
//   //     id: decodedUserInfo.id,
//   //   },
//   //   data: payload,
//   // });
//   // const keysToExclude: (keyof User)[] = ['password', 'pin'];
//   // const updatedResult = excludeFields(result, keysToExclude);
//   // return updatedResult;
// };
exports.UserServices = {
    getMyProfile,
    // updateMyProfile,
};
