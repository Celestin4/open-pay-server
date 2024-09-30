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
    const { sessionId, serviceCode, phoneNumber, text } = req.body;
    let response = '';
    // Log the incoming request body for debugging
    console.log("Request Body:", req.body);
    // Initial welcome message
    if (text === '') {
        response = `CON Welcome to World-M
        1. Check Your Balance
        2. Money Transfer
        3. Buy Airtime
        4. Get mini-statement
        5. Deposit`;
    }
    // Handle balance check
    else if (text === '1') {
        try {
            // Await the database query to ensure the response waits for the balance
            const decodedUserInfo = yield prisma_1.default.user.findUnique({
                where: {
                    phoneNumber, // Using the phone number to fetch the user
                },
                include: {
                    userFinancialInfo: true, // Including financial information
                },
            });
            // Ensure user info was found
            if (!decodedUserInfo || !decodedUserInfo.userFinancialInfo) {
                // If user info or financial info is missing, inform the user
                response = `END User or financial info not found.`;
            }
            else {
                // Retrieve the account balance
                const balance = decodedUserInfo.userFinancialInfo.accountBalance;
                // Prepare the response with the balance
                response = `CON Your account balance is: ${balance} RWF`;
            }
        }
        catch (error) {
            console.error("Error fetching user info:", error);
            // If an error occurs, inform the user
            response = `END An error occurred while fetching your balance.`;
        }
    }
    // Handle other menu options
    else if (text === '2') {
        response = `CON Choose where you want to transfer
        1. Internal Transfer
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
    // Send the final response if it has been set
    if (response) {
        res.send(response); // This will only send a response after all checks and balances have been processed
    }
}));
exports.default = router;
