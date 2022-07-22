const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// Middleware
const secretKey = process.env.SECRET_KEY;
app.set("secretKey", secretKey);

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 3000;
const url = process.env.URL;
app.listen(port, () => console.log(`Server started on ${url}:${port}`));