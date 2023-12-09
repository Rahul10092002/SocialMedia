const express = require("express");
const dotenv = require("dotenv");
const dbconnect = require("./dbConnect");
const authRouter = require("./routers/authRouter");
const postRouter = require("./routers/postRouter");
const userRouter = require("./routers/userRouter");
const cloudinary = require("cloudinary");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
dotenv.config(); // Removed the argument

const app = express();

// Configuration

cloudinary.config({
  cloud_name: "drmzpmevv",
  api_key: "721258238399247",
  api_secret: "eZdNpD_CWtvPQKMK0hqyk37zbpI",
});

// Middlewares

// Allow options preflight requests
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.options("*", cors());

// Add bodyParser.json() before routes
app.use(bodyParser.json({ limit: "10mb" }));

app.use(express.json());
app.use(morgan("common"));
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.status(200).send("OK from server");
});

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).send("Route not found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

dbconnect();

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
