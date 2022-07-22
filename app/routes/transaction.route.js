const express = require("express");
const router = express.Router();

const transactionController = require("../controllers/transaction.controller");

router.get("/user/:user_id", transactionController.getTransactionsByUser);
router.get("/book/:book_id", transactionController.getTransactionsByBook);
router.post("/", transactionController.create);
router.get("/", transactionController.findAll);
router.get("/:id", transactionController.findOne);

module.exports = router;