const redis = require("redis");
const client = redis.createClient();
const redisMiddleware = require("../middlewares/redis");
const { validationResult } = require("express-validator/check");
const db = require("../models");

const Book = db.books;

const redisKeys = ["books", "book"];

const create = async (req, res) => {
  redisMiddleware.removeRedisKey(redisKeys);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      message: "Validation errors",
      errors: errors.array(),
    });
  }

  try {
    const data = {
      title: req.body.title,
      description: req.body.description,
      author: req.body.author,
      publisher: req.body.publisher,
      released_date: req.body.released_date,
      price: req.body.price,
      stock: req.body.stock,
      user_id: req.body.userId,
    };

    const book = await Book.create(data);
    return res.status(201).json({
      status: "success",
      message: "Book created successfully",
      data: book,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong" + err,
    });
  }
};

const findAll = async (req, res) => {
  client.get("books", async (err, data) => {
    try {
      if (data) {
        return res.status(200).json({
          status: "success",
          message: "Books retrieved successfully",
          data: JSON.parse(data),
        });
      } else {
        const books = await Book.findAll({});

        client.set("books", JSON.stringify(books));

        return res.status(200).json({
          status: "success",
          message: "Books retrieved successfully",
          data: books,
        });
      }
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: "Something went wrong",
        errors: err,
      });
    }
  });
};

const findOne = async (req, res) => {
  client.get("book", async (err, data) => {
    try {
      if (data) {
        return res.status(200).json({
          status: "success",
          message: "Book retrieved successfully",
          data: JSON.parse(data),
        });
      } else {
        const book = await Book.findByPk(req.params.id);
        if (!book) {
          return res.status(404).json({
            status: "error",
            message: "Book not found",
          });
        }

        client.set("book", JSON.stringify(book));

        return res.status(200).json({
          status: "success",
          message: "Book retrieved successfully",
          data: book,
        });
      }
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: "Something went wrong",
        errors: err,
      });
    }
  });
};

const update = async (req, res) => {
  redisMiddleware.removeRedisKey(redisKeys);

  const book = await Book.findByPk(req.params.id);
  if (!book) {
    return res.status(404).json({
      status: "error",
      message: "Book not found",
    });
  }

  await Book.update(req.body, { where: { id: req.params.id } })
    .then(() => {
      return Book.findByPk(req.params.id);
    })
    .then((book) => {
      return res.status(200).json({
        status: "success",
        message: "Book updated successfully",
        data: book,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        status: "error",
        message: "Something went wrong",
      });
    });
};

const destroy = async (req, res) => {
  redisMiddleware.removeRedisKey(redisKeys);

  const book = await Book.findByPk(req.params.id);
  if (!book) {
    return res.status(404).json({
      status: "error",
      message: "Book not found",
    });
  }

  await Book.destroy({ where: { id: req.params.id } });

  return res.status(200).json({
    status: "success",
    message: "Book deleted successfully",
  });
};

module.exports = { create, findAll, findOne, update, destroy };
