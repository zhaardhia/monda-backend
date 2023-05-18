"use strict";

const sequelize = require("sequelize");
const Sequelize = require("sequelize")
const { db } = require("../../components/database")
const { Op } = sequelize;
const { 
	product
} = require("../../components/database");

exports.insertProduct = async (payload) => {
  return product.create(payload)
}

exports.getAllProducts = async () => {
  return product.findAll({
    raw: true,
    where: {
      stock: {
        [Op.gt]: 0
      }
    }
  })
}

exports.getProductById = async (id) => {
  return product.findOne({
    raw: true,
    where: {
      id
    }
  })
}