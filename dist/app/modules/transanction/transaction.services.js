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
exports.TransactionServices = void 0;
/* eslint-disable @typescript-eslint/ban-ts-comment */
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const client_1 = require("@prisma/client");
const generateTransactionId_1 = require("../../../helpers/generateTransactionId");
const transaction_utils_1 = require("./transaction.utils");
const userHelpers_1 = require("../../../helpers/userHelpers");
const depositMoney = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedUserInfo = yield (0, transaction_utils_1.transferValidityCheck)(token, payload.amount);
    let transactionInfo = null;
    try {
        yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            if (decodedUserInfo && decodedUserInfo.userFinancialInfo) {
                const userFinancialInfo = decodedUserInfo.userFinancialInfo;
                const newAccountBalance = parseFloat(userFinancialInfo.accountBalance.toString()) + parseFloat(payload.amount.toString());
                yield tx.userFinancialInfo.update({
                    where: { id: userFinancialInfo.id },
                    data: {
                        accountBalance: newAccountBalance, // Ensure this is a float
                        totalDeposit: {
                            increment: parseFloat(payload.amount.toString()), // Ensure this is a float
                        },
                    },
                });
                const deposit = yield tx.deposit.create({
                    data: Object.assign({ transactionId: (0, generateTransactionId_1.generateTransactionId)(generateTransactionId_1.GenerateTransactionIDEnum.Deposit) }, payload),
                });
                transactionInfo = yield tx.transaction.create({
                    data: {
                        userId: decodedUserInfo.id,
                        transactionId: deposit.transactionId,
                        transactionType: client_1.TransactionTypeEnum.Deposit,
                        // reference: payload?.reference,
                        depositId: deposit.id,
                    },
                    include: { deposit: true },
                });
            }
        }));
    }
    catch (error) {
        console.error("Deposit Transaction Error: ", error);
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, `Transaction failed: ${error}`);
    }
    return transactionInfo;
});
const withdrawMoney = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedUserInfo = yield (0, transaction_utils_1.transferValidityCheck)(token, payload.amount);
    let transactionInfo = null;
    yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (decodedUserInfo && decodedUserInfo.userFinancialInfo) {
            const userBalanceAfterTransfer = decodedUserInfo.userFinancialInfo.accountBalance - payload.amount;
            if (userBalanceAfterTransfer < 0) {
                throw new ApiError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'Insufficient Balance');
            }
            yield tx.userFinancialInfo.update({
                where: {
                    id: (_a = decodedUserInfo.userFinancialInfo) === null || _a === void 0 ? void 0 : _a.id,
                },
                data: {
                    accountBalance: userBalanceAfterTransfer,
                    totalWithdraw: { increment: payload.amount },
                },
            });
            const withdraw = yield tx.withdrawal.create({
                data: Object.assign({ transactionId: (0, generateTransactionId_1.generateTransactionId)(generateTransactionId_1.GenerateTransactionIDEnum.Withdrawal) }, payload),
            });
            transactionInfo = yield tx.transaction.create({
                data: {
                    userId: decodedUserInfo.id,
                    transactionId: withdraw.transactionId,
                    transactionType: client_1.TransactionTypeEnum.Withdrawal,
                    // reference: payload.reference,
                    withdrawalId: withdraw.id,
                },
            });
        }
    }));
    return transactionInfo;
});
const transferMoney = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedUserInfo = yield (0, transaction_utils_1.transferValidityCheck)(token, payload.amount);
    console.log(decodedUserInfo);
    let transactionInfo = null;
    yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (decodedUserInfo && decodedUserInfo.userFinancialInfo) {
            const userBalanceAfterTransfer = decodedUserInfo.userFinancialInfo.accountBalance - payload.amount;
            if (userBalanceAfterTransfer < 0) {
                throw new ApiError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'Insufficient Balance');
            }
            if (payload.transferSource === 'Cholti_to_Cholti') {
                const receiver = yield tx.userFinancialInfo.update({
                    where: {
                        accountNumber: payload.bankAccountNo,
                    },
                    data: {
                        accountBalance: { increment: payload.amount },
                    },
                });
                payload.receiverId = receiver.userId;
            }
            yield tx.userFinancialInfo.update({
                where: {
                    id: (_a = decodedUserInfo.userFinancialInfo) === null || _a === void 0 ? void 0 : _a.id,
                },
                data: {
                    accountBalance: userBalanceAfterTransfer,
                    totalTransfer: { increment: payload.amount },
                },
            });
            const transfer = yield tx.transfer.create({
                data: Object.assign({ transactionId: (0, generateTransactionId_1.generateTransactionId)(generateTransactionId_1.GenerateTransactionIDEnum.Transfer) }, payload),
            });
            transactionInfo = yield tx.transaction.create({
                data: {
                    userId: decodedUserInfo.id,
                    transactionId: transfer.transactionId,
                    transactionType: client_1.TransactionTypeEnum.Transfer,
                    // reference: payload.reference,
                    transferId: transfer.id,
                },
            });
        }
    }));
    return transactionInfo;
});
const mobileRecharge = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedUserInfo = yield (0, transaction_utils_1.transferValidityCheck)(token, payload.amount);
    let transactionInfo = null;
    yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (decodedUserInfo && decodedUserInfo.userFinancialInfo) {
            const userBalanceAfterTransfer = decodedUserInfo.userFinancialInfo.accountBalance - payload.amount;
            if (userBalanceAfterTransfer < 0) {
                throw new ApiError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'Insufficient Balance');
            }
            yield tx.userFinancialInfo.update({
                where: {
                    id: (_a = decodedUserInfo.userFinancialInfo) === null || _a === void 0 ? void 0 : _a.id,
                },
                data: {
                    accountBalance: userBalanceAfterTransfer,
                    totalRecharge: { increment: payload.amount },
                },
            });
            const mobileRecharge = yield tx.mobileRecharge.create({
                data: Object.assign({ transactionId: (0, generateTransactionId_1.generateTransactionId)(generateTransactionId_1.GenerateTransactionIDEnum.Mobile_Recharge) }, payload),
            });
            transactionInfo = yield tx.transaction.create({
                data: {
                    userId: decodedUserInfo.id,
                    transactionId: mobileRecharge.transactionId,
                    transactionType: client_1.TransactionTypeEnum.Mobile_Recharge,
                    // reference: 'Mobile Recharge',
                    mobileRechargeId: mobileRecharge.id,
                },
            });
        }
    }));
    return transactionInfo;
});
const getMyStatements = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyDecodedUser = yield userHelpers_1.UserHelpers.verifyDecodedUser(token);
    const result = yield prisma_1.default.transaction.findMany({
        where: {
            userId: verifyDecodedUser === null || verifyDecodedUser === void 0 ? void 0 : verifyDecodedUser.id,
        },
        include: {
            deposit: true,
            withdrawal: true,
            transfer: true,
        },
    });
    return result;
});
exports.TransactionServices = {
    depositMoney,
    withdrawMoney,
    transferMoney,
    mobileRecharge,
    getMyStatements,
};
