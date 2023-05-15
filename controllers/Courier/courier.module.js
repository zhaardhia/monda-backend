"use strict";

const sequelize = require("sequelize");
const Sequelize = require("sequelize")
const { db } = require("../../components/database")
const { Op } = sequelize;
const { 
  courier
} = require("../../components/database");

exports.getCourierById = async (id) => {
  return courier.findOne({
    raw: true,
    where: {
      id
    },
  })
}

exports.getAllCourier = async () => {
  return courier.findAll({
    raw: true,
  })
}