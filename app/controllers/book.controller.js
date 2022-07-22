const db = require("../models");

const Book = db.books;

const create = async (req, res) => {
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
  const books = await Book.findAll({});

  return res.status(200).json({
    status: "success",
    message: "Books retrieved successfully",
    data: books,
  });
};

const findOne = async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (!book) {
    return res.status(404).json({
      status: "error",
      message: "Book not found",
    });
  }

  return res.status(200).json({
    status: "success",
    message: "Book retrieved successfully",
    data: book,
  });
};

const update = async (req, res) => {
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
