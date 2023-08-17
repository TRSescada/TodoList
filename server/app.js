require("dotenv").config();
require("./config/dbConfig");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const app = express();

//? Services like render use something called a proxy and you need to add this to your server
app.set("trust proxy", 1);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Set the header to 'true'
  next();
});
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
  })
);

app.use("/api", require("./routes/index"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/me/todoList", require("./routes/todoList"));
app.use("/api/me/task", require("./routes/task"));
require("./error-handling/index")(app);

module.exports = app;
