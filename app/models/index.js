const dbConfig = require("../config/db.config.js");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((err) => console.error("Unable to connect to the database:", err));

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model")(sequelize, DataTypes);
db.books = require("./book.model")(sequelize, DataTypes);
db.transactions = require("./transaction.model")(sequelize, DataTypes);

db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Drop and Resync with { force: false }");
  })
  .catch((err) => {
    console.log("Error:", err);
  });

db.users.hasMany(db.books, { foreignKey: "user_id", as: "books" });
db.users.hasMany(db.transactions, {
  foreignKey: "user_id",
  as: "transactions",
});
db.books.belongsTo(db.users, { foreignKey: "user_id", as: "user" });
db.books.hasMany(db.transactions, {
  foreignKey: "book_id",
  as: "transactions",
});
db.transactions.belongsTo(db.books, { foreignKey: "book_id", as: "book" });
db.transactions.belongsTo(db.users, { foreignKey: "user_id", as: "user" });

module.exports = db;
