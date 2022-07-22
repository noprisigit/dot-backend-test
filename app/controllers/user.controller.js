const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const db = require("../models");

const User = db.users;

const register = async (req, res) => {
  User.findOne({
    where: { email: req.body.email },
  }).then((user) => {
    if (user) {
      return res.status(400).json({
        status: "error",
        message: "User already exists",
      });
    }
  });

  const data = {
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, saltRounds),
  };

  const user = await User.create(data);

  return res.status(201).json({
    status: "success",
    message: "User created successfully",
    data: user,
  });
};

const login = async (req, res) => {
  await User.findOne({
    where: { email: req.body.email },
  }).then((user) => {
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User does not exist",
      });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid Password",
      });
    }

    const token = jwt.sign({ id: user.id }, req.app.get("secretKey"), {
      expiresIn: "1h",
    });

    return res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      data: user,
      token: token,
    });
  });
};

module.exports = { register, login };