"use strict";

const sequelize = require("sequelize");
const Sequelize = require("sequelize")
const { Op } = require("sequelize");
const { 
  db,
  product
} = require("../../components/database");

exports.get3BestSellerProduct = async (myId) => {  
  const query = `SELECT product_id, SUM(quantity) AS total_quantity
  FROM order_item
  GROUP BY product_id
  ORDER BY total_quantity DESC
  LIMIT 3;`

  const resultQuery = await db.query(query, {
    raw: true,
    type: Sequelize.QueryTypes.SELECT,
  })
  .then(result => {
      // console.log(result)
      return result
  })
  return resultQuery
}

exports.getProductDetail = async (id) => {
  return product.findOne({
    raw: true,
    where: {
      id
    }
  })
}

exports.getAllProducts = async () => {
  return product.findAll({
    raw: true,
  })
}