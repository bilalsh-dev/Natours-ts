import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import catchAsync from "../utils/catchAsync";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../utils/appError";
import { promisify } from "util";

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    const token = signToken(newUser._id);

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    // 2) Check if user exists and password is correct
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user?.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    const token = signToken(user._id);
    res.status(200).json({
      status: "success",
      token,
      //   data: {
      //     user: newUser,
      //   },
    });
  }
);
declare global {
  namespace Express {
    interface Request {
      user?: typeof User | undefined;
    }
  }
}
export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else {
      next(
        new AppError("You are not logged in! Please log in to get access", 401)
      );
    }
    // 2) Verification token
    // let decoded = "";
    // try {
    //   decoded = jwt.verify(
    //     token as string,
    //     process.env.JWT_SECRET as string
    //   ) as string;
    // } catch (err) {
    //   next(err); // as we pass error here it will be captured by the global error handler
    // }
    const decoded = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    // as { id: string };

    // 3) Check if user still exists or user deleted after JWT was issued
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      new AppError(
        "The user belonging to this token does no longer exist.",
        404
      );
    }
    // 4) Check if user changed password after the JWT was issued
    if (freshUser!.changedPasswordAfter(decoded.iat!)) {
      return next(
        new AppError(
          "User recently changed password! Please log in again.",
          401
        )
      );
    }
    // Grant access to the protected route
    if (freshUser) req.user = freshUser as User;
    next();
  }
);
