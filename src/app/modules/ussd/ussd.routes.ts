import express, { Request, Response } from 'express';
const router = express.Router();
import prisma from '../../../shared/prisma';
// import excludeFields from '../../../helpers/excludingfields';

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

  } else if (text === '1') {
        const decodedUserInfo = await prisma.user.findUnique({
          where: {
            phoneNumber
          },
          include: {
            userFinancialInfo: true,
          },
        });

        const balance = decodedUserInfo?.userFinancialInfo?.accountBalance 
       console.log(balance)

        response = `CON Your account balance is:${balance} RWF
       `;

  } else if (text === '2') {
     response = `CON Choose where you want to transfer
        1. Internal Tranfer
        2. Bank of Kigali
        3. MTN Mobile Money`;

  } else if (text === '3') {
    response = `CON Choose provider network
        1. MTN
        2. AirTel`;}
  else if (text === '1*1') {
    const accountNumber = 'ACC100101';
    response = `END Your account number is ${accountNumber}`;

  } else if (text === '1*2') {
    const balance = 'KES 10,000';
    response = `END Your balance is ${balance}`;
  }

  res.send(response);
});

export default router;
