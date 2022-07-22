const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");

const userRoute = require("./user.route");
const bookRoute = require("./book.route");

router.use("/api/v1", userRoute);
router.use("/api/v1/books", authenticate, bookRoute);

module.exports = router;