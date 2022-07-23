const redis = require("redis");
const logger = require("../loggers/logger");
const client = redis.createClient();
const redisMiddleware = require("../middlewares/redis");
const { sequelize } = require("../models");
const db = require("../models");

const User = db.users;
const Book = db.books;
const Transaction = db.transactions;

const redisKeys = [
  "transaction",
  "transaction",
  "transactions.user:*",
  "transactions.book:*",
];

const create = async (req, res) => {
  redisMiddleware.removeRedisKey(redisKeys);

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

    logger.debug(err);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
      errors: err,
    });
  }
};

const findAll = async (req, res) => {
  client.get("transactions", async (err, data) => {
    try {
      if (data) {
        return res.status(200).json({
          status: "success",
          message: "Transactions retrieved successfully",
          data: JSON.parse(data),
        });
      } else {
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

        client.set("transactions", JSON.stringify(transactions));

        return res.status(200).json({
          status: "success",
          message: "Transactions retrieved successfully",
          data: transactions,
        });
      }
    } catch (err) {
      logger.debug(err);
      return res.status(500).json({
        status: "error",
        message: "Something went wrong",
        errors: err,
      });
    }
  });
};

const findOne = async (req, res) => {
  client.get("transaction", async (err, data) => {
    try {
      if (data) {
        return res.status(200).json({
          status: "success",
          message: "Transaction retrieved successfully",
          data: JSON.parse(data),
        });
      } else {
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

        client.set("transaction", JSON.stringify(transaction));

        return res.status(200).json({
          status: "success",
          message: "Transaction retrieved successfully",
          data: transaction,
        });
      }
    } catch (err) {
      logger.debug(err);
      return res.status(500).json({
        status: "error",
        message: "Something went wrong",
        errors: err,
      });
    }
  });
};

const getTransactionsByUser = async (req, res) => {
  const userId = req.params.user_id;

  client.get("transactions.user:" + userId, async (err, data) => {
    try {
      if (data) {
        return res.status(200).json({
          status: "success",
          message: "Transactions retrieved successfully",
          data: JSON.parse(data),
        });
      } else {
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

        client.set("transactions.user:" + userId, JSON.stringify(transactions));

        return res.status(200).json({
          status: "success",
          message: "Transactions retrieved successfully",
          data: transactions,
        });
      }
    } catch (err) {
      logger.debug(err);
      return res.status(500).json({
        status: "error",
        message: "Something went wrong",
        errors: err,
      });
    }
  });
};

const getTransactionsByBook = async (req, res) => {
  const bookId = req.params.book_id;

  client.get("transactions.book:" + bookId, async (err, data) => {
    try {
      if (data) {
        return res.status(200).json({
          status: "success",
          message: "Transactions retrieved successfully",
          data: JSON.parse(data),
        });
      } else {
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

        client.set("transactions.book:" + bookId, JSON.stringify(transactions));

        return res.status(200).json({
          status: "success",
          message: "Transactions retrieved successfully",
          data: transactions,
        });
      }
    } catch (err) {
      logger.debug(err);
      return res.status(500).json({
        status: "error",
        message: "Something went wrong",
        errors: err,
      });
    }
  });
};

module.exports = {
  create,
  findAll,
  findOne,
  getTransactionsByUser,
  getTransactionsByBook,
};
