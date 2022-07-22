const { sequelize } = require("../models");
const db = require("../models");

const User = db.users;
const Book = db.books;
const Transaction = db.transactions;

const create = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const bookId = req.body.book_id;
    const userId = req.body.userId;
    const quantity = req.body.quantity;

    const book = await Book.findOne({
      where: {
        id: bookId,
      },
    }).then((book) => {
      return book;
    });

    if (!book) {
      return res.status(404).json({
        status: "error",
        message: "Book not found",
      });
    }

    if (book.stock < 1) {
      return res.status(400).json({
        status: "error",
        message: "Book is out of stock",
      });
    }

    if (book.user_id === userId) {
      return res.status(400).json({
        status: "error",
        message: "You can't buy your own book",
      });
    }

    if (quantity > book.stock) {
      return res.status(400).json({
        status: "error",
        message: "Not enough stock",
      });
    }

    const data = {
      book_id: bookId,
      user_id: userId,
      quantity: quantity,
      total_price: book.price * quantity,
    };
    const transaction = await Transaction.create(data, { transaction: t });

    await book.update(
      {
        stock: book.stock - quantity,
      },
      { where: { id: bookId }, transaction: t }
    );

    await t.commit();

    return res.status(200).json({
      status: "success",
      message: "Book purchased successfully",
      data: transaction,
    });
  } catch (err) {
    await t.rollback();

    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
      errors: err,
    });
  }
};

const findAll = async (req, res) => {
  const transactions = await Transaction.findAll({
    include: [
      {
        model: Book,
        as: "book",
      },
      {
        model: User,
        as: "user",
      },
    ],
  });

  return res.status(200).json({
    status: "success",
    message: "Transactions retrieved successfully",
    data: transactions,
  });
};

const findOne = async (req, res) => {
  const transaction = await Transaction.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Book,
        as: "book",
      },
      {
        model: User,
        as: "user",
      },
    ],
  });

  if (!transaction) {
    return res.status(404).json({
      status: "error",
      message: "Transaction not found",
    });
  }

  return res.status(200).json({
    status: "success",
    message: "Transaction retrieved successfully",
    data: transaction,
  });
};

const getTransactionsByUser = async (req, res) => {
  const userId = req.params.user_id;

  const transactions = await Transaction.findAll({
    where: {
      user_id: userId,
    },
    include: [
      {
        model: Book,
        as: "book",
      },
      {
        model: User,
        as: "user",
      },
    ],
  });

  if (!transactions) {
    return res.status(404).json({
      status: "error",
      message: "Transaction not found",
    });
  }

  return res.status(200).json({
    status: "success",
    message: "Transactions retrieved successfully",
    data: transactions,
  });
}

const getTransactionsByBook = async (req, res) => {
  const bookId = req.params.book_id;

  const transactions = await Transaction.findAll({
    where: {
      book_id: bookId,
    },
    include: [
      {
        model: Book,
        as: "book",
      },
      {
        model: User,
        as: "user",
      },
    ],
  });

  if (!transactions) {
    return res.status(404).json({
      status: "error",
      message: "Transaction not found",
    });
  }

  return res.status(200).json({
    status: "success",
    message: "Transactions retrieved successfully",
    data: transactions,
  });
};

module.exports = { create, findAll, findOne, getTransactionsByUser, getTransactionsByBook };
