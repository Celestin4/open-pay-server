import express, { Request, Response } from 'express';
const router = express.Router();
import prisma from '../../../shared/prisma';

interface UssdRequest {
  sessionId: string;
  serviceCode: string;
  phoneNumber: string;
  text: string;
}

router.post('/', async (req: Request<{}, {}, UssdRequest>, res: Response) => {
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
      const decodedUserInfo = await prisma.user.findUnique({
        where: {
          phoneNumber,  // Using the phone number to fetch the user
        },
        include: {
          userFinancialInfo: true, // Including financial information
        },
      });

      // Ensure user info was found
      if (!decodedUserInfo || !decodedUserInfo.userFinancialInfo) {
        // If user info or financial info is missing, inform the user
        response = `END User or financial info not found.`;
      } else {
        // Retrieve the account balance
        const balance = decodedUserInfo.userFinancialInfo.accountBalance;
        console.log(phoneNumber)

        // Prepare the response with the balance
        response = `CON Your account balance is: ${balance} RWF`;
      }
    } catch (error) {
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
  } else if (text === '3') {
    response = `CON Choose provider network
        1. MTN
        2. AirTel`;
  } else if (text === '1*1') {
    const accountNumber = 'ACC100101';
    response = `END Your account number is ${accountNumber}`;
  } else if (text === '1*2') {
    const balance = 'KES 10,000';
    response = `END Your balance is ${balance}`;
  }

  // Send the final response if it has been set
  if (response) {
    res.send(response); // This will only send a response after all checks and balances have been processed
  }
});

export default router;
