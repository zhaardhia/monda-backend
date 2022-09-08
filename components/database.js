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

const tunai_user = require("../models/tunai_user");
const log_migrationphoto_oss = require("../models/log_migrationphoto_oss");

module.exports = {
  tunai_users: tunai_user(db, DataTypes),
  log_migrationphoto_oss: log_migrationphoto_oss(db, DataTypes),
  db,
};