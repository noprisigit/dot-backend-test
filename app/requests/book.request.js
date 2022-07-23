const { body } = require("express-validator/check");

const validateInput = (method) => {
  switch (method) {
    case "createBook": {
      return [
        body("title").trim().notEmpty(),
        body("description").trim().isLength({ min: 3 }).notEmpty(),
        body("author").trim().notEmpty(),
        body("publisher").trim().notEmpty(),
        body("released_date").trim().isDate().notEmpty(),
        body("price").trim().notEmpty().isFloat(),
        body("stock").trim().notEmpty().isInt(),
      ];
    }
  }
};

module.exports = { validateInput };
