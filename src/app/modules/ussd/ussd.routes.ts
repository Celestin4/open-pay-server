import express, { Request, Response } from 'express';
const router = express.Router();
import prisma from '../../../shared/prisma';
import { generateTransactionId, GenerateTransactionIDEnum } from '../../../helpers/generateTransactionId';
import { DepositSourceEnum, TransactionTypeEnum, TransferSourceEnum } from '@prisma/client';

interface UssdRequest {
  sessionId: string;
  serviceCode: string;
  phoneNumber: string;
  text: string;
}

router.post('/', async (req: Request<{}, {}, UssdRequest>, res: Response) => {
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
      const decodedUserInfo = await prisma.user.findUnique({
        where: { phoneNumber },
        include: { userFinancialInfo: true },
      });

      if (!decodedUserInfo || !decodedUserInfo.userFinancialInfo) {
        response = `END User or financial info not found.`;
      } else {
        const balance = decodedUserInfo.userFinancialInfo.accountBalance;
        response = `CON Your account balance is: ${balance} RWF`;
      }
    } catch (error) {
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
      } else {
        const decodedUserInfo = await prisma.user.findUnique({
          where: { phoneNumber },
          include: { userFinancialInfo: true },
        });

        if (!decodedUserInfo || !decodedUserInfo.userFinancialInfo) {
          response = `END User or financial info not found.`;
        } else {
          const senderBalance = decodedUserInfo.userFinancialInfo.accountBalance!;

          if (senderBalance < amount) {
            response = `END Insufficient balance for this transfer.`;
          } else {
            await prisma.$transaction(async (tx) => {
              
              // Debit sender's account
              await tx.userFinancialInfo.update({
                where: { id: decodedUserInfo.userFinancialInfo!.id },
                data: { accountBalance: { decrement: amount } },
              });
              
              // Credit receiver's account
              await tx.userFinancialInfo.update({
                where: { accountNumber: receiverAccount },
                data: { accountBalance: { increment: amount } },
              });
              
              // Record the transfer transaction
              await tx.transfer.create({
                data: {
                  transactionId: generateTransactionId(GenerateTransactionIDEnum.Transfer),
                  bankAccountNo: receiverAccount,
                  transferSource: TransferSourceEnum.Cholti_to_Cholti,
                  amount,
                  reference: `Internal transfer from ${phoneNumber} to ${receiverAccount}`,
                },
              });
            });

            response = `END Transfer of ${amount} RWF to account ${receiverAccount} was successful.`;
          }
        }
      }
    } catch (error) {
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
      } else {
        const decodedUserInfo = await prisma.user.findUnique({
          where: { phoneNumber },
          include: { userFinancialInfo: true },
        });

        if (!decodedUserInfo || !decodedUserInfo.userFinancialInfo) {
          response = `END User or financial info not found.`;
        } else {
          const senderBalance = decodedUserInfo.userFinancialInfo.accountBalance!;

          if (senderBalance < amount) {
            response = `END Insufficient balance for this transfer.`;
          } else {
            await prisma.$transaction(async (tx) => {
              
              // Debit sender's account
              await tx.userFinancialInfo.update({
                where: { id: decodedUserInfo.userFinancialInfo!.id },
                data: { accountBalance: { decrement: amount } },
              });
              
              // Record the transfer transaction
              await tx.transfer.create({
                data: {
                  transactionId: generateTransactionId(GenerateTransactionIDEnum.Transfer),
                  bankAccountNo: receiverAccount,
                  transferSource: TransferSourceEnum.Cholti_to_Cholti,
                  amount,
                  reference: `Internal transfer from ${phoneNumber} to ${receiverAccount}`,
                },
              });
            });

            response = `END Transfer of ${amount} RWF to account ${receiverAccount} was successful.`;
          }
        }
      }
    } catch (error) {
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
      } else {
        const decodedUserInfo = await prisma.user.findUnique({
          where: { phoneNumber },
          include: { userFinancialInfo: true },
        });

        if (!decodedUserInfo || !decodedUserInfo.userFinancialInfo) {
          response = `END User or financial info not found.`;
        } else {
          const senderBalance = decodedUserInfo.userFinancialInfo.accountBalance!;

          if (senderBalance < amount) {
            response = `END Insufficient balance for this transfer.`;
          } else {
            await prisma.$transaction(async (tx) => {
              
              // Debit sender's account
              await tx.userFinancialInfo.update({
                where: { id: decodedUserInfo.userFinancialInfo!.id },
                data: { accountBalance: { decrement: amount } },
              });
              
              // Record the transfer transaction
              await tx.transfer.create({
                data: {
                  transactionId: generateTransactionId(GenerateTransactionIDEnum.Transfer),
                  bankAccountNo: receiverAccount,
                  transferSource: TransferSourceEnum.Cholti_to_Cholti,
                  amount,
                  reference: `Internal transfer from ${phoneNumber} to ${receiverAccount}`,
                },
              });
            });

            response = `END Transfer of ${amount} RWF to account ${receiverAccount} was successful.`;
          }
        }
      }
    } catch (error) {
      console.log(error);
      response = `END An error occurred during the transfer.`;
    }
  }


  else if (text === '4') {
    try {
      const decodedUserInfo = await prisma.user.findUnique({
        where: { phoneNumber },
      });
  
      const result = await prisma.transaction.findMany({
        where: {
          userId: decodedUserInfo?.id,
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
        } else if (transaction.withdrawal) {
          amount = transaction.withdrawal.amount;
        } else if (transaction.transfer) {
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
  
    } catch (error) {
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
        } else {
          const decodedUserInfo = await prisma.userFinancialInfo.findUnique({
            where: { accountNumber:receiverAccount },
          });
  
          if (!decodedUserInfo) {
            response = `END User or financial info not found.`;
          } else {
            const currentBalance = decodedUserInfo.accountBalance!;
        const newAccountBalance = parseFloat(currentBalance.toString()) + parseFloat(amount.toString());

  
            if (!currentBalance) {
              response = `END Insufficient balance for this transfer.`;
            } else {
              await prisma.$transaction(async (tx) => {

              

                
                const userId = decodedUserInfo.id!;
                console.log(userId)
                
                await tx.userFinancialInfo.update({
                  where: { id: userId },
                  data: {
                    accountBalance: newAccountBalance,
                    totalDeposit: {
                      increment: parseFloat(amount.toString()),
                    },
                  },
                });
                console.log( decodedUserInfo)
        
              const deposit =  await tx.deposit.create({
                  data: {
                    transactionId: generateTransactionId(GenerateTransactionIDEnum.Deposit),
                    depositSource: DepositSourceEnum.bank_transfer,
                    amount
                  },
                });

                await tx.transaction.create({
                  data: {
                    userId: decodedUserInfo.userId,
                    transactionId: deposit.transactionId,
                    transactionType: TransactionTypeEnum.Deposit,
                    // reference: payload?.reference,
                    depositId: deposit.id,
                  },
                  include: { deposit: true },
                });

                
              });
  
              response = `END Transfer of ${amount} RWF to account ${receiverAccount} was successful.`;
            }
          }
        }
      } catch (error) {
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
        } else {
          const decodedUserInfo = await prisma.userFinancialInfo.findUnique({
            where: { accountNumber:receiverAccount },
          });
  
          if (!decodedUserInfo) {
            response = `END User or financial info not found.`;
          } else {
            const currentBalance = decodedUserInfo.accountBalance!;
        const newAccountBalance = parseFloat(currentBalance.toString()) + parseFloat(amount.toString());

  
            if (!currentBalance) {
              response = `END Insufficient balance for this transfer.`;
            } else {
              await prisma.$transaction(async (tx) => {

              

                
                const userId = decodedUserInfo.id!;
                console.log(userId)
                
                await tx.userFinancialInfo.update({
                  where: { id: userId },
                  data: {
                    accountBalance: newAccountBalance,
                    totalDeposit: {
                      increment: parseFloat(amount.toString()),
                    },
                  },
                });
                console.log( decodedUserInfo)
        
              const deposit =  await tx.deposit.create({
                  data: {
                    transactionId: generateTransactionId(GenerateTransactionIDEnum.Deposit),
                    depositSource: DepositSourceEnum.agent,
                    amount
                  },
                });

                await tx.transaction.create({
                  data: {
                    userId: decodedUserInfo.userId,
                    transactionId: deposit.transactionId,
                    transactionType: TransactionTypeEnum.Deposit,
                    // reference: payload?.reference,
                    depositId: deposit.id,
                  },
                  include: { deposit: true },
                });

                
              });
  
              response = `END Transfer of ${amount} RWF to account ${receiverAccount} was successful.`;
            }
          }
        }
      } catch (error) {
        console.log(error);
        response = `END An error occurred during the transfer.`;
      }
    }

  if (response) {
    res.send(response);
  }
});

export default router;
