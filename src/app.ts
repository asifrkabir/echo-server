/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import config from "./app/config";

const app: Application = express();

app.use(
  cors({
    origin: [config.client_url as string],
    credentials: true,
  })
);
app.use(cookieParser());

// Parsers
app.use(express.json());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send(`App is listening on port ${config.port}`);
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
