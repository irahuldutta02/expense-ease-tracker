const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const { PORT } = require("./config/server.config.js");
const connectDB = require("./db/db.js");
const { errorHandler, notFound } = require("./middleware/error.middleware.js");

const categoryRoutes = require("./routes/category.routes.js");
const expenseRoutes = require("./routes/expense.routes.js");
const modeRoutes = require("./routes/mode.routes.js");
const partyRoutes = require("./routes/party.routes.js");
const userRoutes = require("./routes/user.routes.js");

const app = express();
connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://expense-ease-tracker.vercel.app",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  next();
});

app.use(
  cors({
    origin: [
      "http://127.0.0.1:5173",
      "http://localhost:5173",
      "https://expense-ease-tracker.vercel.app",
    ],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

app.get("/", (req, res) => {
  return res.status(200).json({
    status: 200,
    port: PORT,
    message: "ExpenseEase api is up and running!",
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
