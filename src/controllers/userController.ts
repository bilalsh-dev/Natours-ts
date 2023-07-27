import { Request, Response } from 'express';

export const getAllUsers = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    results: 0,
    data: null,
  });
};
export const createUser = (req: Request, res: Response) => {
  res.status(201).json({
    status: 'success',
    results: 1,
    data: null,
  });
};
export const getUser = (req: Request, res: Response) => {
  res.status(404).json({
    status: 'fail',
    message: 'Invalid Id',
  });
};
export const updateUser = (req: Request, res: Response) => {
  res.status(404).json({
    status: 'fail',
    message: 'Invalid Id',
  });
};

export const deleteUser = (req: Request, res: Response) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
