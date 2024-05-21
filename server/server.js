import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { PORT } from "./config/server.config.js";
import connectDB from "./db/db.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";

import categoryRoutes from "./routes/category.routes.js";
import expenseRoutes from "./routes/expense.routes.js";
import modeRoutes from "./routes/mode.routes.js";
import partyRoutes from "./routes/party.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();
connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

app.use(cors());
app.use(cookieParser());

app.get("/", (req, res) => {
  return res.status(200).json({
    status: 200,
    message: "API is running...",
  });
});

app.use("/api/users", userRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/mode", modeRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/party", partyRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
