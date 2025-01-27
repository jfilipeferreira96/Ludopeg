const express = require("express");
const routes = require("./routes");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const db = require("./config/db");
const Logger = require("./utils/logger");

require("dotenv").config();

app.use((req, res, next) => {
  const logData = {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
  };

  Logger.request(JSON.stringify(logData));

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});

// CORS configuration
const corsOptions = {
  origin: ["http://localhost:3000", "https://localhost:3000", "https://app.ludopedagogica.org/", "https://app.ludopedagogica.org", "http://app.ludopedagogica.org", "http://app.ludopedagogica.org/"],
  credentials: true,
};
app.use(cors(corsOptions));

app.set("view engine", "ejs");

app.use(routes);

db.connect();

module.exports = app;
