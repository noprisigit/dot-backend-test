const express = require("express");
const router = express.Router();

const userRoute = require("./user.route");

router.use("/api/v1", userRoute);

module.exports = router;