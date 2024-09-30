"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTransactionId = exports.GenerateTransactionIDEnum = void 0;
/* eslint-disable no-unused-vars */
var GenerateTransactionIDEnum;
(function (GenerateTransactionIDEnum) {
    GenerateTransactionIDEnum["Deposit"] = "DEP";
    GenerateTransactionIDEnum["Withdrawal"] = "WIT";
    GenerateTransactionIDEnum["Transfer"] = "TRA";
    GenerateTransactionIDEnum["Mobile_Recharge"] = "MBR";
})(GenerateTransactionIDEnum || (exports.GenerateTransactionIDEnum = GenerateTransactionIDEnum = {}));
const generateTransactionId = (transactionType) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2);
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if needed
    const day = currentDate.getDate().toString().padStart(2, '0'); // Add leading zero if needed
    const randomDigits = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, '0');
    const transactionId = `${year}${month}${day}${transactionType}${randomDigits}`;
    return transactionId;
};
exports.generateTransactionId = generateTransactionId;
