import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';

import httpStatus from 'http-status';
import sendResponse from '../../../shared/sendResponse';
import { AdminServices } from './admin.services';

const createEmployees = catchAsync(async (req: Request, res: Response) => {
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
  const result = await AdminServices.createEmployees(authToken, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Employee created successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
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
  const result = await AdminServices.getAllUsers(authToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Users Retried',
    data: result,
  });
});

const getAllEmployees = catchAsync(async (req: Request, res: Response) => {
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
  const result = await AdminServices.getAllEmployees(authToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Users data retried',
    data: result,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
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
  const { id } = req.params;
  const result = await AdminServices.getSingleUser(authToken, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User data retried',
    data: result,
  });
});


const getAllTransactions = catchAsync(async (req: Request, res: Response) => {
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
  const result = await AdminServices.getAllTransactions(authToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All transactions retrieve',
    data: result,
  });
});

export const AdminController = {
  createEmployees,
  getAllUsers,
  getAllEmployees,
  getSingleUser,
  getAllTransactions
};
