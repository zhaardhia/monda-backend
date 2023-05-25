"use strict";

const sequelize = require("sequelize");
const {Sequelize, QueryTypes} = require("sequelize")

const { Op } = require("sequelize");
const { 
  db,
  product,
  order_item,
  order
} = require("../../components/database");

exports.get3BestSellerProduct = async (myId) => {  
  // const query = `SELECT product_id, SUM(quantity) AS total_quantity
  // FROM order_item
  // GROUP BY product_id
  // ORDER BY total_quantity DESC
  // LIMIT 3;`

  // const query = `
  //   SELECT oi.product_id, SUM(oi.quantity) AS total_quantity
  //   FROM order_item AS oi
  //   JOIN \`order\` AS o ON oi.order_id = o.id
  //   WHERE o.status_order IN ('paid_verified', 'shipment', 'completed')
  //   GROUP BY oi.product_id
  //   ORDER BY total_quantity DESC
  //   LIMIT 3;
  // `;

  // const resultQuery = await db.query(query, {
  //   raw: true,
  //   type: Sequelize.QueryTypes.SELECT,
  // })
  //   .then(result => {
  //     // console.log(result)
  //     return result
  // })
  // return resultQuery

  const statusValues = ['paid_verified', 'shipment', 'completed'];

  const query = `
    SELECT oi.product_id, SUM(oi.quantity) AS total_quantity
    FROM order_item AS oi
    JOIN \`order\` AS o ON oi.order_id = o.id
    WHERE o.status_order IN (?, ?, ?)
    GROUP BY oi.product_id
    ORDER BY total_quantity DESC
    LIMIT 3;
  `;

  const results = await db.query(query, {
    type: QueryTypes.SELECT,
    replacements: statusValues,
  })
  .then(result => {
      // console.log(result)
      return result
  })
  return results
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