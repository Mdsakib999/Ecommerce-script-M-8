import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";

import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./config/db";
import adminRouter from "./routes/admin.route";
import authRouter from "./routes/auth.route";
import paymentRouter from "./routes/payment.route";
import userRouter from "./routes/user.route";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(bodyParser.json());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:5173"],
    credentials: true,
  })
);

connectDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome!");
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/payment", paymentRouter);

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}

export default app;
