import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";
import { CastError } from "mongoose";

// interface IAppError extends Error {
//   statusCode?: number;
//   status?: string;
//   isOperational: boolean;
// }
const handleCastErrorDB = (err: CastError) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err: any) => {
  const [[key, value]] = Object.entries(err.keyValue);

  const message = `Duplicate field value:${key} ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: any) => {
  console.log("err", err);
  const errors = Object.values(err.errors).map((el: any) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode!).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err: AppError, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode!).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error("ERROR ", err);
    // 2) Send general message
    res.status(500).json({
      message: "Something went wrong!",
      status: `error`,
    });
  }
};
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (err.name === "CastError") error = handleCastErrorDB(error as any);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);

    if (err.name === "ValidationError") {
      error = handleValidationErrorDB(error);
    }

    sendErrorProd(error, res);
  }
};
