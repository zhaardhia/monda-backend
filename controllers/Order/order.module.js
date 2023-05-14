"use strict";

const sequelize = require("sequelize");
const Sequelize = require("sequelize")
const { db } = require("../../components/database")
const { Op } = sequelize;
const { 
    shopping_session,
    cart_item,
    product,
    order,
    order_item,
    courier,
    user
} = require("../../components/database");

exports.getShoppingSessionToOrder = async (user_id) => {
  return shopping_session.findOne({
    raw: true,
    where: {
      user_id
    }
  })
}

exports.getCartItemToOrder = async (session_id) => {
  const productAssociate = cart_item.hasOne(product, {foreignKey: "id", sourceKey: "product_id"})
  return cart_item.findAll({
    raw: true,
    include: [
      {
        association: productAssociate,
        required: false,
      }
    ],
    attributes: ["id", "session_id", "product_id", "quantity"],
    where: {
      session_id
    }
  })
}

exports.getUserTransaction = async (id) => {
  return user.findOne({
    raw: true,
    where: {
      id,
      role: 1
    },
    attributes: ["email", "first_name", "last_name", "fullname", "phone"]
  })
}

exports.getNumberOrder = async (user_id) => {
  return order.findAll({
    raw: true,
    where: {
      user_id
    },
    order: [
      ['order_no', 'DESC'],
    ],
    attributes: ["id", "order_no"]
  })
}

exports.getCourierById = async (id) => {
  return courier.findOne({
    raw: true,
    where: {
      id
    },
  })
}

exports.createOrder = async (payload) => {
  return order.create(payload)
}

exports.createOrderItem = async (payload) => {
  return order_item.create(payload)
}

exports.deleteShoppingSession = async (id) => {
  return shopping_session.destroy({
    where: {
      id
    }
  })
}

exports.deleteCartItem = async (session_id) => {
  return cart_item.destroy({
    where: {
      session_id
    }
  })
}

exports.updateProductStock = async (id, stock) => {
  return product.update(
    {
      stock
    },
    {
      where: {
        id
      }
    }
  )
}

exports.updateStatusOrder = async (id, status_order) => {
  return order.update(
    {
      status_order,
      updated_date: new Date()
    },
    {
      where: {
        id
      }
    }
  )
}

exports.updateResiOrder = async (id, resi) => {
  return order.update(
    {
      resi,
      updated_date: new Date()
    },
    {
      where: {
        id
      }
    }
  )
}

exports.getListOrderByUserId = async (user_id) => {
  return order.findAll({
    raw: true,
    where: {
      user_id    
    }
  })
}

exports.getOrderByUserId = async (id) => {
  return order.findOne({
    raw: true,
    where: {
      id
    }
  })
}

exports.getOrderDetailByOrderId = async (order_id) => {
  return order_item.findAll({
    raw: true,
    where: {
      order_id
    }
  })
}