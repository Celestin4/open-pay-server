import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import bcrypt from 'bcrypt';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { IUserLogin } from './auth.interface';
import { IUser } from '../user/user.interface';
import { generateAccountNumber } from '../../../helpers/generateAccountNumber';
import { UserRole } from '@prisma/client';

const userSignUp = async (payload: IUser) => {
  // Check for existing phone number and national ID
  const userPhoneAlreadyExist = await prisma.user.findFirst({
    where: { phoneNumber: payload.phoneNumber },
  });
  if (userPhoneAlreadyExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Phone Number Already Exist');
  }

  const userNationalIdAlreadyExist = await prisma.user.findFirst({
    where: { nationalId: payload.nationalId },
  });
  if (userNationalIdAlreadyExist) {
    throw new ApiError(httpStatus.CONFLICT, 'National ID Already Exist');
  }

  // Hash the password and pin
  const hashPassword = await bcrypt.hash(
    payload.password,
    Number(config.bycrypt_salt_rounds),
  );
  const hashPin = await bcrypt.hash(
    payload.pin,
    Number(config.bycrypt_salt_rounds),
  );
  payload.password = hashPassword;
  payload.pin = hashPin;

  try {
    // Create user and associated data in a transaction
    const user = await prisma.$transaction(async (tx) => {
      // Create the user
      const newUser = await tx.user.create({
        data: {
          role: UserRole.user,
          ...payload,
        },
      });

      // Create related entities (personal info, device info, financial info)
      try {
        console.log('Creating personal info...');
        await tx.personalInfo.create({
          data: {
            userId: newUser.id,
          },
        });
      } catch (error) {
        console.warn('Error creating personal info:', error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create personal info');
      }

      // try {
      //   console.log('Creating device info...');
      //   await tx.deviceInfo.create({
      //     data: {
      //       userId: newUser.id,
      //     },
      //   });
      // } catch (error) {
      //   console.warn('Error creating device info:', error);
      //   throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create device info');
      // }

      try {
        console.log('Creating financial info...');
        await tx.userFinancialInfo.create({
          data: {
            accountNumber: generateAccountNumber(newUser.phoneNumber),
            user: {
              connect: {
                id: newUser.id,
              },
            },
          },
        });
      } catch (error) {
        console.warn('Error creating financial info:', error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create financial info');
      }

      return newUser;
    });

    // Generate access token
    const accessToken = jwtHelpers.createToken(
      { userId: user.id, role: user.role },
      config.jwt.secret as string,
      config.jwt.expires_in as string,
    );

    return accessToken;

  } catch (error) {
    console.error('Transaction Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Transaction failed');
  }
};

const loginUser = async (payload: IUserLogin) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      phoneNumber: payload.phoneNumber,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User or Password Not Matching');
  }

  const isPasswordMatch = await bcrypt.compare(
    payload.password,
    isUserExist.password,
  );

  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User or Password Not Matching');
  }

  const userId = isUserExist.id;
  const role = isUserExist.role;

  const accessToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as string,
    config.jwt.expires_in as string,
  );

  return accessToken;
};

export const AuthServices = {
  userSignUp,
  loginUser,
};
