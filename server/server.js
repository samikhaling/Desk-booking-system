const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");
const companyRoutes = require("./routes/company");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, PATCH, GET, POST, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(userRoutes);
app.use(companyRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  console.log(message, "message");
  res.status(status).json({ message: message });
});

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then((success) => {
    app.listen(3080);
    console.log("Database Connection Successfull");
  })
  .catch((err) => {
    throw new Error("Database Connection Failed");
  });
