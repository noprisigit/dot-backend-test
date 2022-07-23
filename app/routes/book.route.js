const express = require("express");
const router = express.Router();

const bookController = require("../controllers/book.controller");
const bookRequest = require("../requests/book.request");

router.post("/", bookRequest.validateInput("createBook"), bookController.create);
router.get("/", bookController.findAll);
router.get("/:id", bookController.findOne);
router.put("/:id", bookController.update);
router.delete("/:id", bookController.destroy);

module.exports = router;