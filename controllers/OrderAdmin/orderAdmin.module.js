"use strict";

const sequelize = require("sequelize");
const Sequelize = require("sequelize")
const { Op } = sequelize;
const { 
	db,
  order,
  user,
  order_item,
  payment_order,
  product
} = require("../../components/database");

exports.getLatestTransaction = async () => {
  const userAssociate = order.hasOne(user, {foreignKey: "id", sourceKey: "user_id"})
  return order.findAll({
    raw: true,
    include: [
      {
        association: userAssociate,
        required: true,
        attributes: ["id", "fullname"]
      }
    ],
    order: [
      ['created_date', 'DESC'],
    ],
    limit: 3,
  })
}

exports.getThisMonthsIncome = async (from, to) => {
  return order.findAll({
    raw: true,
    where: {
      created_date: {
        [Op.between] : [from, to]
      }
    }
  })
}

exports.getOrderByUserId = async (id) => {
  const paymentAssociate = order_item.hasOne(payment_order, {foreignKey: "order_id", sourceKey: "id"})
  const userAssociate = order.hasOne(user, {foreignKey: "id", sourceKey: "user_id"})
  return order.findOne({
    raw: true,
    include: [
      {
        association: paymentAssociate,
        required: false,
        attributes: ["id", "order_id", "provider"]
      },
      {
        association: userAssociate,
        required: false,
        attributes: ["id", "fullname", "email", "phone", "created_date"]
      }
    ],
    where: {
      id
    }
  })
}

exports.getOrderDetailByOrderId = async (order_id) => {
  const productAssociate = order_item.hasOne(product, {foreignKey: "id", sourceKey: "product_id"})
  return order_item.findAll({
    raw: true,
    include: [
      {
        association: productAssociate,
        required: false,
        attributes: ["id", "name", "price", "image"]
      }
    ],
    where: {
      order_id
    }
  })
}

exports.getListOrder = async () => {
  const userAssociate = order.hasOne(user, {foreignKey: "id", sourceKey: "user_id"})
  return order.findAll({
    raw: true,
    order: [
      ['created_date', 'DESC'],
    ],    
    include: [
      {
        association: userAssociate,
        required: false,
        attributes: ["id", "fullname"]
      }
    ],
    attributes: ["id", "user_id", "order_no", "gross_amount", "status_order", "created_date"]
  })
}

exports.getListPengiriman = async () => {
  return order.findAll({
    raw: true,
    order: [
      ['created_date', 'DESC'],
    ], 
    where: {
      status_order: {
        [Op.or]: ["shipment", "completed"]
      }
    }
  })
}