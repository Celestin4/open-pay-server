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
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
        const decodedUserInfo = yield prisma_1.default.user.findUnique({
            where: {
                phoneNumber
            },
            include: {
                userFinancialInfo: true,
            },
        });
        response = `CON Your account balance is:${(_a = decodedUserInfo === null || decodedUserInfo === void 0 ? void 0 : decodedUserInfo.userFinancialInfo) === null || _a === void 0 ? void 0 : _a.accountBalance} RWF
       `;
    }
    else if (text === '2') {
        response = `CON Choose where you want to transfer
        1. Internal Tranfer
        2. Bank of Kigali
        3. MTN Mobile Money`;
    }
    else if (text === '3') {
        response = `CON Choose provider network
        1. MTN
        2. AirTel`;
    }
    else if (text === '1*1') {
        const accountNumber = 'ACC100101';
        response = `END Your account number is ${accountNumber}`;
    }
    else if (text === '1*2') {
        const balance = 'KES 10,000';
        response = `END Your balance is ${balance}`;
    }
    res.send(response);
}));
exports.default = router;
