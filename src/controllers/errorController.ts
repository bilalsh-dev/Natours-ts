import { Request, Response, NextFunction, response } from "express";
import AppError from "../utils/appError";
// interface IAppError extends Error {
//   statusCode?: number;
//   status?: string;
//   isOperational: boolean;
// }
const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
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
  err: AppError,
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
    if (error.name === "CastError") handleCastErrorDB(error);
    sendErrorProd(error, res);
  }
};
