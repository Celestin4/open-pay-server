import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import httpStatus from 'http-status';
import sendResponse from '../../../shared/sendResponse';
import { UserServices } from './user.services';

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: 'Authorization token is missing',
    });
  }

  const authToken = authHeader.split(' ')[1];
  if (!authToken) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: 'Token is missing',
    });
  }

  const result = await UserServices.getMyProfile(authToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: 'Authorization token is missing',
    });
  }

  const authToken = authHeader.split(' ')[1];
  if (!authToken) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: 'Token is missing',
    });
  }

  const payload = req.body;
  const result = await UserServices.updateMyProfile(authToken, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Data updated successfully',
    data: result,
  });
});

export const UserController = {
  getMyProfile,
  updateMyProfile,
};
