const express = require("express");
const router = express.Router();

const bookController = require("../controllers/book.controller");

router.post("/", bookController.create);
router.get("/", bookController.findAll);
router.get("/:id", bookController.findOne);
router.put("/:id", bookController.update);
router.delete("/:id", bookController.destroy);

module.exports = router;