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
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const generateTransactionId_1 = require("../../../helpers/generateTransactionId");
const client_1 = require("@prisma/client");
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;
    let response = '';
    if (text === '') {
        response = `CON Welcome to World-M
        1. Check Your Balance
        2. Money Transfer
        3. Buy Airtime
        4. Get mini-statement
        5. Deposit`;
    }
    else if (text === '1') {
        try {
            const decodedUserInfo = yield prisma_1.default.user.findUnique({
                where: { phoneNumber },
                include: { userFinancialInfo: true },
            });
            if (!decodedUserInfo || !decodedUserInfo.userFinancialInfo) {
                response = `END User or financial info not found.`;
            }
            else {
                const balance = decodedUserInfo.userFinancialInfo.accountBalance;
                response = `CON Your account balance is: ${balance} RWF`;
            }
        }
        catch (error) {
            response = `END An error occurred while fetching your balance.`;
        }
    }
    else if (text === '2') {
        response = `CON Choose where you want to transfer
        1. Internal Transfer
        2. Bank of Kigali
        3. MTN Mobile Money`;
    }
    else if (text === '5') {
        response = `CON Deposit money from:
        1. Bank Transfer
        2. World-M Agent`;
    }
    // Prompt for account number
    else if (text === '2*1') {
        response = `CON Enter receiver World-M account number:`;
    }
    // After entering account number, prompt for the amount
    else if (text.startsWith('2*1*') && text.split('*').length === 3) {
        const receiverAccount = text.split('*')[2];
        response = `CON Enter amount to transfer to account ${receiverAccount}:`;
    }
    // After entering both account number and amount, process the transfer
    else if (text.startsWith('2*1*') && text.split('*').length === 4) {
        try {
            const details = text.split('*');
            const receiverAccount = details[2];
            const amount = parseFloat(details[3]);
            if (isNaN(amount) || amount <= 0) {
                response = `END Invalid amount entered.`;
            }
            else {
                const decodedUserInfo = yield prisma_1.default.user.findUnique({
                    where: { phoneNumber },
                    include: { userFinancialInfo: true },
                });
                if (!decodedUserInfo || !decodedUserInfo.userFinancialInfo) {
                    response = `END User or financial info not found.`;
                }
                else {
                    const senderBalance = decodedUserInfo.userFinancialInfo.accountBalance;
                    if (senderBalance < amount) {
                        response = `END Insufficient balance for this transfer.`;
                    }
                    else {
                        yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                            // Debit sender's account
                            yield tx.userFinancialInfo.update({
                                where: { id: decodedUserInfo.userFinancialInfo.id },
                                data: { accountBalance: { decrement: amount } },
                            });
                            // Credit receiver's account
                            yield tx.userFinancialInfo.update({
                                where: { accountNumber: receiverAccount },
                                data: { accountBalance: { increment: amount } },
                            });
                            // Record the transfer transaction
                            yield tx.transfer.create({
                                data: {
                                    transactionId: (0, generateTransactionId_1.generateTransactionId)(generateTransactionId_1.GenerateTransactionIDEnum.Transfer),
                                    bankAccountNo: receiverAccount,
                                    transferSource: client_1.TransferSourceEnum.Cholti_to_Cholti,
                                    amount,
                                    reference: `Internal transfer from ${phoneNumber} to ${receiverAccount}`,
                                },
                            });
                        }));
                        response = `END Transfer of ${amount} RWF to account ${receiverAccount} was successful.`;
                    }
                }
            }
        }
        catch (error) {
            console.log(error);
            response = `END An error occurred during the transfer.`;
        }
    }
    // Prompt for account number
    else if (text === '2*2') {
        response = `CON Enter receiver Bk account number:`;
    }
    // After entering account number, prompt for the amount
    else if (text.startsWith('2*2*') && text.split('*').length === 3) {
        const receiverAccount = text.split('*')[2];
        response = `CON Enter amount to transfer to account ${receiverAccount}:`;
    }
    // After entering both account number and amount, process the transfer
    else if (text.startsWith('2*2*') && text.split('*').length === 4) {
        try {
            const details = text.split('*');
            const receiverAccount = details[2];
            const amount = parseFloat(details[3]);
            if (isNaN(amount) || amount <= 0) {
                response = `END Invalid amount entered.`;
            }
            else {
                const decodedUserInfo = yield prisma_1.default.user.findUnique({
                    where: { phoneNumber },
                    include: { userFinancialInfo: true },
                });
                if (!decodedUserInfo || !decodedUserInfo.userFinancialInfo) {
                    response = `END User or financial info not found.`;
                }
                else {
                    const senderBalance = decodedUserInfo.userFinancialInfo.accountBalance;
                    if (senderBalance < amount) {
                        response = `END Insufficient balance for this transfer.`;
                    }
                    else {
                        yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                            // Debit sender's account
                            yield tx.userFinancialInfo.update({
                                where: { id: decodedUserInfo.userFinancialInfo.id },
                                data: { accountBalance: { decrement: amount } },
                            });
                            // Record the transfer transaction
                            yield tx.transfer.create({
                                data: {
                                    transactionId: (0, generateTransactionId_1.generateTransactionId)(generateTransactionId_1.GenerateTransactionIDEnum.Transfer),
                                    bankAccountNo: receiverAccount,
                                    transferSource: client_1.TransferSourceEnum.Cholti_to_Cholti,
                                    amount,
                                    reference: `Internal transfer from ${phoneNumber} to ${receiverAccount}`,
                                },
                            });
                        }));
                        response = `END Transfer of ${amount} RWF to account ${receiverAccount} was successful.`;
                    }
                }
            }
        }
        catch (error) {
            console.log(error);
            response = `END An error occurred during the transfer.`;
        }
    }
    // Prompt for account number
    else if (text === '2*3') {
        response = `CON Enter receiver Bk account number:`;
    }
    // After entering account number, prompt for the amount
    else if (text.startsWith('2*3*') && text.split('*').length === 3) {
        const receiverAccount = text.split('*')[2];
        response = `CON Enter amount to transfer to account ${receiverAccount}:`;
    }
    // After entering both account number and amount, process the transfer
    else if (text.startsWith('2*3*') && text.split('*').length === 4) {
        try {
            const details = text.split('*');
            const receiverAccount = details[2];
            const amount = parseFloat(details[3]);
            if (isNaN(amount) || amount <= 0) {
                response = `END Invalid amount entered.`;
            }
            else {
                const decodedUserInfo = yield prisma_1.default.user.findUnique({
                    where: { phoneNumber },
                    include: { userFinancialInfo: true },
                });
                if (!decodedUserInfo || !decodedUserInfo.userFinancialInfo) {
                    response = `END User or financial info not found.`;
                }
                else {
                    const senderBalance = decodedUserInfo.userFinancialInfo.accountBalance;
                    if (senderBalance < amount) {
                        response = `END Insufficient balance for this transfer.`;
                    }
                    else {
                        yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                            // Debit sender's account
                            yield tx.userFinancialInfo.update({
                                where: { id: decodedUserInfo.userFinancialInfo.id },
                                data: { accountBalance: { decrement: amount } },
                            });
                            // Record the transfer transaction
                            yield tx.transfer.create({
                                data: {
                                    transactionId: (0, generateTransactionId_1.generateTransactionId)(generateTransactionId_1.GenerateTransactionIDEnum.Transfer),
                                    bankAccountNo: receiverAccount,
                                    transferSource: client_1.TransferSourceEnum.Cholti_to_Cholti,
                                    amount,
                                    reference: `Internal transfer from ${phoneNumber} to ${receiverAccount}`,
                                },
                            });
                        }));
                        response = `END Transfer of ${amount} RWF to account ${receiverAccount} was successful.`;
                    }
                }
            }
        }
        catch (error) {
            console.log(error);
            response = `END An error occurred during the transfer.`;
        }
    }
    else if (text === '4') {
        try {
            const decodedUserInfo = yield prisma_1.default.user.findUnique({
                where: { phoneNumber },
            });
            const result = yield prisma_1.default.transaction.findMany({
                where: {
                    userId: decodedUserInfo === null || decodedUserInfo === void 0 ? void 0 : decodedUserInfo.id,
                },
                orderBy: {
                    createdAt: 'desc', // Orders transactions by the latest first
                },
                take: 5, // Limits the result to the last 5 transactions
                include: {
                    deposit: true,
                    withdrawal: true,
                    transfer: true,
                },
            });
            // Extract only transactionType and amount
            const filteredResult = result.map((transaction) => {
                let amount = null;
                if (transaction.deposit) {
                    amount = transaction.deposit.amount;
                }
                else if (transaction.withdrawal) {
                    amount = transaction.withdrawal.amount;
                }
                else if (transaction.transfer) {
                    amount = transaction.transfer.amount;
                }
                return {
                    transactionType: transaction.transactionType,
                    amount,
                };
            });
            // Format the transactions into a response string
            response = `END Last 5 Transactions:\n`;
            filteredResult.forEach((transaction, index) => {
                response += `${index + 1}. ${transaction.transactionType}: ${transaction.amount} \n`;
            });
        }
        catch (error) {
            response = `END An error occurred while fetching your balance.`;
        }
    }
    // Prompt for account number
    else if (text === '5*1') {
        response = `CON Enter receiver World-M account number:`;
    }
    // After entering account number, prompt for the amount
    else if (text.startsWith('5*1*') && text.split('*').length === 3) {
        const receiverAccount = text.split('*')[2];
        response = `CON Enter amount to transfer from account ${receiverAccount}:`;
    }
    // After entering both account number and amount, process the transfer
    else if (text.startsWith('5*1*') && text.split('*').length === 4) {
        try {
            const details = text.split('*');
            const receiverAccount = details[2];
            const amount = parseFloat(details[3]);
            if (isNaN(amount) || amount <= 0) {
                response = `END Invalid amount entered.`;
            }
            else {
                const decodedUserInfo = yield prisma_1.default.userFinancialInfo.findUnique({
                    where: { accountNumber: receiverAccount },
                });
                if (!decodedUserInfo) {
                    response = `END User or financial info not found.`;
                }
                else {
                    const currentBalance = decodedUserInfo.accountBalance;
                    const newAccountBalance = parseFloat(currentBalance.toString()) + parseFloat(amount.toString());
                    if (!currentBalance) {
                        response = `END Insufficient balance for this transfer.`;
                    }
                    else {
                        yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                            const userId = decodedUserInfo.id;
                            console.log(userId);
                            yield tx.userFinancialInfo.update({
                                where: { id: userId },
                                data: {
                                    accountBalance: newAccountBalance,
                                    totalDeposit: {
                                        increment: parseFloat(amount.toString()),
                                    },
                                },
                            });
                            console.log(decodedUserInfo);
                            const deposit = yield tx.deposit.create({
                                data: {
                                    transactionId: (0, generateTransactionId_1.generateTransactionId)(generateTransactionId_1.GenerateTransactionIDEnum.Deposit),
                                    depositSource: client_1.DepositSourceEnum.bank_transfer,
                                    amount
                                },
                            });
                            yield tx.transaction.create({
                                data: {
                                    userId: decodedUserInfo.userId,
                                    transactionId: deposit.transactionId,
                                    transactionType: client_1.TransactionTypeEnum.Deposit,
                                    // reference: payload?.reference,
                                    depositId: deposit.id,
                                },
                                include: { deposit: true },
                            });
                        }));
                        response = `END Transfer of ${amount} RWF to account ${receiverAccount} was successful.`;
                    }
                }
            }
        }
        catch (error) {
            console.log(error);
            response = `END An error occurred during the transfer.`;
        }
    }
    // Prompt for account number
    else if (text === '5*2') {
        response = `CON Enter receiver World-M account number:`;
    }
    // After entering account number, prompt for the amount
    else if (text.startsWith('5*2*') && text.split('*').length === 3) {
        const receiverAccount = text.split('*')[2];
        response = `CON Enter amount to transfer from account ${receiverAccount}:`;
    }
    // After entering both account number and amount, process the transfer
    else if (text.startsWith('5*2*') && text.split('*').length === 4) {
        try {
            const details = text.split('*');
            const receiverAccount = details[2];
            const amount = parseFloat(details[3]);
            if (isNaN(amount) || amount <= 0) {
                response = `END Invalid amount entered.`;
            }
            else {
                const decodedUserInfo = yield prisma_1.default.userFinancialInfo.findUnique({
                    where: { accountNumber: receiverAccount },
                });
                if (!decodedUserInfo) {
                    response = `END User or financial info not found.`;
                }
                else {
                    const currentBalance = decodedUserInfo.accountBalance;
                    const newAccountBalance = parseFloat(currentBalance.toString()) + parseFloat(amount.toString());
                    if (!currentBalance) {
                        response = `END Insufficient balance for this transfer.`;
                    }
                    else {
                        yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                            const userId = decodedUserInfo.id;
                            console.log(userId);
                            yield tx.userFinancialInfo.update({
                                where: { id: userId },
                                data: {
                                    accountBalance: newAccountBalance,
                                    totalDeposit: {
                                        increment: parseFloat(amount.toString()),
                                    },
                                },
                            });
                            console.log(decodedUserInfo);
                            const deposit = yield tx.deposit.create({
                                data: {
                                    transactionId: (0, generateTransactionId_1.generateTransactionId)(generateTransactionId_1.GenerateTransactionIDEnum.Deposit),
                                    depositSource: client_1.DepositSourceEnum.agent,
                                    amount
                                },
                            });
                            yield tx.transaction.create({
                                data: {
                                    userId: decodedUserInfo.userId,
                                    transactionId: deposit.transactionId,
                                    transactionType: client_1.TransactionTypeEnum.Deposit,
                                    // reference: payload?.reference,
                                    depositId: deposit.id,
                                },
                                include: { deposit: true },
                            });
                        }));
                        response = `END Transfer of ${amount} RWF to account ${receiverAccount} was successful.`;
                    }
                }
            }
        }
        catch (error) {
            console.log(error);
            response = `END An error occurred during the transfer.`;
        }
    }
    if (response) {
        res.send(response);
    }
}));
exports.default = router;
