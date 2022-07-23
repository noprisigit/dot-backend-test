const { body } = require("express-validator/check");

const validateInput = (method) => {
  switch (method) {
    case "login": {
      return [
        body("email").trim().isEmail().notEmpty(),
        body("password").notEmpty(),
      ];
    }
    case "register": {
      return [
        body("name").trim().isLength({ min: 3 }).notEmpty(),
        body("email").trim().isEmail().notEmpty(),
        body("password").notEmpty().isLength({ min: 6 }),
      ];
    }
  }
};

module.exports = { validateInput };
