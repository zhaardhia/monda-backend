"use strict";

const response = require("../../components/response")
const shoppingCartModule = require("./shoppingCart.module")
const { db } = require("../../components/database")
const bcrypt = require("bcrypt")
const { nanoid } = require('nanoid');
const jwt = require("jsonwebtoken")

exports.cartItem = async (req, res, next) => {
  let payload = {
    user_id: req.body.user_id,
    product_id: req.body.product_id
  }
  const checkShoppingSession = await shoppingCartModule.getShoppingSessionById(payload.user_id)
  if (!checkShoppingSession) {
    const getProductById = await shoppingCartModule.getProductById(payload.product_id)
    if (getProductById.stock < 1) return response.res200(res, "001", "stock habis.")

    const sessionId = nanoid(20);

    const dbTransaction = await db.transaction()

    const payloadShoppingSession = {
      transaction: dbTransaction,
      id: sessionId,
      user_id: payload.user_id,
      total_amount: getProductById.price
    }
    const payloadCartItem = {
      transaction: dbTransaction,
      id: nanoid(20),
      session_id: sessionId,
      product_id: payload.product_id,
      quantity: 1
    }

    try {
      await shoppingCartModule.insertShoppingSession(payloadShoppingSession)
      await shoppingCartModule.insertCartItem(payloadCartItem)
      await dbTransaction.commit()
      return response.res200(res, "000", "Sukses insert shopping cart")
    } catch (error) {
      console.error(error)
      await dbTransaction.rollback()
      return response.res200(res, "001", "Terjadi kesalahan ketika input data shopping cart")
    }
  } else {
    const getStock = await shoppingCartModule.getProductById(payload.product_id)
    if (!getStock) return response.res400(res, "Product Tidak Terdaftar")

    if (req.body.quantity + 1 > getStock.stock) return response.res200(res, "001", "Stock habis")

    payload.session_id = checkShoppingSession.id
    const checkCartItem = await shoppingCartModule.getCartItemById(payload.session_id, payload.product_id)
    if (!checkCartItem) {
      const cartId = nanoid(20)
      const dbTransaction = await db.transaction()

      const payloadCartItem = {
        transaction: dbTransaction,
        id: cartId,
        session_id: payload.session_id,
        product_id: payload.product_id,
        quantity: 1
      }

      try {
        await shoppingCartModule.insertCartItem(payloadCartItem)
        await dbTransaction.commit()
      } catch (error) {
        console.error(error)
        await dbTransaction.rollback()
        return response.res200(res, "001", "Terjadi kesalahan update data quantity cart item")
      }
    } else {
      payload.cart_id = checkCartItem.id
      const dbTransaction = await db.transaction()
      try {
        await shoppingCartModule.updateQuantityCartItem(dbTransaction, payload.cart_id, payload.session_id, checkCartItem.quantity + 1)
        await dbTransaction.commit()
      } catch (error) {
        console.error(error)
        await dbTransaction.rollback()
        return response.res200(res, "001", "Terjadi kesalahan update data quantity cart item")
      }
    }
    
    const dbTransaction2 = await db.transaction()
    try {
      await shoppingCartModule.updateTotalAmountShoppingSession(dbTransaction2, payload.session_id, checkShoppingSession.total_amount + getStock.price)

      await dbTransaction2.commit()
      return response.res200(res, "000", "Sukses update data shopping cart")
    } catch (error) {
      console.error(error)
      await dbTransaction2.rollback()
      return response.res200(res, "001", "Terjadi kesalahan update data shopping session")
    }
  }
}

exports.minShoppingCart = async (req, res, next) => {
  const payload = {
    user_id: req.body.user_id,
    product_id: req.body.product_id
  }
  const checkShoppingSession = await shoppingCartModule.getShoppingSessionById(payload.user_id)

  const getStock = await shoppingCartModule.getProductById(payload.product_id)
  if (!getStock) return response.res400(res, "Product Tidak Terdaftar")

  // if (req.body.quantity + 1 > getStock.stock) return response.res200(res, "001", "Stock habis")

  if (checkShoppingSession) {
    payload.session_id = checkShoppingSession.id
    const checkCartItem = await shoppingCartModule.getCartItemById(payload.session_id, payload.product_id)
    payload.cart_id = checkCartItem.id

    const dbTransaction = await db.transaction()
    try {
      if (checkCartItem.quantity > 1) {
        await shoppingCartModule.updateQuantityCartItem(dbTransaction, payload.cart_id, payload.session_id, checkCartItem.quantity - 1)

        await shoppingCartModule.updateTotalAmountShoppingSession(dbTransaction, payload.session_id, checkShoppingSession.total_amount - getStock.price)

      } else if (checkCartItem.quantity === 1) {
        await shoppingCartModule.deleteCartItem(payload.cart_id)
        const checkAllCartItem = await shoppingCartModule.getAllCartWithSessionId(payload.session_id)
        console.log(checkAllCartItem)
        if (checkAllCartItem.length < 1) await shoppingCartModule.deleteShoppingSession(payload.session_id)
        else await shoppingCartModule.updateTotalAmountShoppingSession(dbTransaction, payload.session_id, checkShoppingSession.total_amount - getStock.price)
      }
      await dbTransaction.commit()
      return response.res200(res, "000", "Sukses mengurangi cart item")
    } catch (error) {
      console.error(error)
      await dbTransaction.rollback()
      return response.res200(res, "001", "Terjadi kesalahan update data quantity cart item")
    }
  } else {
    return response.res400(res, "Tidak ada cart")
  }  
}

exports.getUserCart = async (req, res, next) => {
  const resUserCart = await shoppingCartModule.getUserCart(req.query.user_id)
  if (resUserCart.length < 1) return response.res200(res, "000", "Cart masih kosong")
  // console.log(resUserCart);
  const responseCart = {
    shopping_session_id: resUserCart[0].id,
    user_id: resUserCart[0].user_id,
    total_amount: resUserCart[0].total_amount,
    delivery_location: resUserCart[0].delivery_location,
    courier_id: resUserCart[0].courier_id,
    user_cart: resUserCart
  }
  // console.log(response);
  return response.res200(res, "000", "Sukses mengambil seluruh data cart pada user", responseCart)
}