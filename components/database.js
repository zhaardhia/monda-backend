"use strict";
const { Sequelize, DataTypes } = require("sequelize");
const { DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT } = process.env;

const db = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mysql",
  timezone: "+07:00",
  logging: false,
  define: {
    freezeTableName: true,
    timestamps: false,
  },
});

db.authenticate()
  .then(() => console.log(`Connected to database : ${DB_HOST}:${DB_PORT}`))
  .catch(() => console.error(`Unable to connect to the database!`));

const user = require("../models/user");
const product = require("../models/product");
const shopping_session = require("../models/shopping_session");
const cart_item = require("../models/cart_item");
const courier = require("../models/courier");
const order = require("../models/order");
const order_item = require("../models/order_item");
const payment_order = require("../models/payment_order");

module.exports = {
  user: user(db, DataTypes),
  product: product(db, DataTypes),
  shopping_session: shopping_session(db, DataTypes),
  cart_item: cart_item(db, DataTypes),
  courier: courier(db, DataTypes),
  order: order(db, DataTypes),
  order_item: order_item(db, DataTypes),
  payment_order: payment_order(db, DataTypes),
  db,
};
