import express, { Application, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import tourRouter from "./routes/tourRoutes";
import userRouter from "./routes/userRoutes";
import AppError from "./utils/appError";
import { globalErrorHandler } from "./controllers/errorController";
const app: Application = express();
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(`${__dirname}/../public`));
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("Hello from middleWare");
  next();
});
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
export default app;
