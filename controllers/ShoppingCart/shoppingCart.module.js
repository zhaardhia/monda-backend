"use strict";

const sequelize = require("sequelize");
const Sequelize = require("sequelize")
const { db } = require("../../components/database")
const { Op } = sequelize;
const { 
	product,
  shopping_session,
  cart_item,
  user
} = require("../../components/database");

exports.getUserCartItemPrice = async (session_id) => {
  const productAssociate = cart_item.hasOne(product, {foreignKey: "id", sourceKey: "product_id"})
  return cart_item.findAll({
    raw: true,
    include: [
      {
        association: productAssociate,
        attributes: ["id", "name", "price"],
        required: false,
      },
    ],
    attributes: ["id", "session_id", "product_id", "quantity"],
    where: {
      session_id,
    }
  })
}

exports.insertShoppingSession = async (payload) => {
  return shopping_session.create(payload)
}

exports.updateTotalAmountShoppingSession = async (dbTransaction, id, total_amount) => {
  return shopping_session.update(
    {
      total_amount
    },
    {
      where: {
        id
      },
      transaction: dbTransaction
    }
  )
}

exports.updateQuantityCartItem = async (dbTransaction, id, session_id, quantity) => {
  return cart_item.update(
    {
      quantity
    },
    {
      where: {
        id,
        session_id
      },
      transaction: dbTransaction
    }
  )
}

exports.insertCartItem = async (payload) => {
  return cart_item.create(payload)
}

exports.deleteShoppingSession = async (id) => {
  return shopping_session.destroy({
    where: {
      id
    }
  })
}

exports.deleteCartItem = async (id) => {
  return cart_item.destroy({
    where: {
      id
    }
  })
}

exports.getUserCartItem = async (session_id) => {
  const productAssociate = cart_item.hasOne(product, {foreignKey: "id", sourceKey: "product_id"})
  return cart_item.findAll({
    raw: true,
    include: [
      {
        association: productAssociate,
        required: false,
      },
    ],
    attributes: ["id", "session_id", "product_id", "quantity"],
    where: {
      session_id,
    }
  })
}

exports.getUserShoppingSession = async (user_id) => {
  const userAssociate = shopping_session.hasOne(user, {foreignKey: "id", sourceKey: "user_id"})
  return shopping_session.findOne({
    raw: true,
    include: [
      {
        association: userAssociate,
        required: true,
      },
    ],
    where: {
      user_id
    }
  })
}

exports.getProductById = async (id) => {
  return product.findOne({
    raw: true,
    where: {
      id
    },
    attributes: ["id", "name", "price", "stock"]
  })
}

exports.getShoppingSessionById = async (user_id) => {
  return shopping_session.findOne({
    raw: true,
    where: {
      user_id
    },
    attributes: ["id", "user_id", "total_amount", "delivery_location", "courier_id"]
  })
}

exports.getShoppingSessionBySessionId = async (id) => {
  return shopping_session.findOne({
    raw: true,
    where: {
      id
    },
    attributes: ["id", "user_id", "total_amount", "delivery_location", "courier_id"]
  })
}

exports.getCartItemById = async (session_id, product_id) => {
  const productAssociate = cart_item.hasOne(product, {foreignKey: "id", sourceKey: "product_id"})

  return cart_item.findOne({
    raw: true,
    include: [
      {
        association: productAssociate,
        required: true,
        attributes: ["id", "name", "price"]
      },
    ],
    where: {
      session_id,
      product_id
    },
    attributes: ["id", "session_id", "product_id", "quantity"]
  })
}

exports.getCartItemQuantity = async (id) => {
  return cart_item.findOne({
    raw: true,
    where: {
      id
    },
    attributes: ["id", "quantity"]
  })
}

exports.getAllCartWithSessionId = async (session_id) => {
  return cart_item.findAll({
    raw: true,
    where: {
      session_id
    },
    attributes: ["id", "quantity"]
  })
}


exports.getUserCart = async (user_id) => {
  const cartAssociate = shopping_session.hasMany(cart_item, {foreignKey: "session_id", sourceKey: "id"})
  const productAssociate = cart_item.hasOne(product, {foreignKey: "id", sourceKey: "product_id"})

  return shopping_session.findAll({
    raw: true,
    include: [
      {
        association: cartAssociate,
        required: false,
        include: [
          {
            association: productAssociate,
            required: false,
          }
        ],
        attributes: ["id", "session_id", "product_id", "quantity"]
      },
    ],
    where: {
      user_id
    }
  })
}

exports.updateDeliveryLocation = async (id, address) => {
  return shopping_session.update(
    {
      delivery_location: address
    },
    {
      where: {
        id
      }
    }
  )
}

exports.updateCourier = async (id, courier_id) => {
  return shopping_session.update(
    {
      courier_id
    },
    {
      where: {
        id
      }
    }
  )
}