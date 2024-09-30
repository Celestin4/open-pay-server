const dotenv = require('dotenv');

dotenv.config();

const TEST_ACCOUNT = {
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
  format: 'json'
};

const phoneNumber = process.env.TEST_PHONENUMBER || '';

module.exports = { TEST_ACCOUNT, phoneNumber };
