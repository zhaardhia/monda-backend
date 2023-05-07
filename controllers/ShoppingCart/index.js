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

  // insert
  if (req.body.method === "insert") {
    
  } else if (req.body.method === "update_plus") {
    

  } else if (req.body.method === "update_minus") {
    

  } else if (req.body.method === "delete") {
    const getQuantity = await shoppingCartModule.getCartItemQuantity(req.body.cart_id) 
    if (!getQuantity) return response.res400(res, "Product Tidak Terdaftar")

    if (req.body.quantity > 0 ) return response.res200(res, "001", "Wrong Method.")

    try {
      await shoppingCartModule.deleteCartItem(req.body.cart_id)

      const checkAllCartItem = shoppingCartModule.getAllCartWithSessionId(req.body.session_id)
      if (!checkAllCartItem) await shoppingCartModule.deleteShoppingSession(req.body.session_id)

      return response.res200(res, "000", "Sukses menghapus cart item");
    } catch (error) {
      console.error(error)
      return response.res200(res, "001", "Terjadi kesalahan ketika menghapus cart item");
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

  if (req.body.quantity + 1 > getStock.stock) return response.res200(res, "001", "Stock habis")

  payload.session_id = checkShoppingSession.id
  const checkCartItem = await shoppingCartModule.getCartItemById(payload.session_id, payload.product_id)

  const getQuantity = await shoppingCartModule.getCartItemQuantity(req.body.cart_id)
  if (!getQuantity) return response.res400(res, "Product Tidak Terdaftar")

  if (req.body.quantity - 1 >= 0 ) return response.res200(res, "001", "Wrong Method.")

  const dbTransaction = await db.transaction()
  try {
    await shoppingCartModule.updateQuantityCartItem(dbTransaction, req.body.cart_id, req.body.session_id, req.body.quantity - 1)
    await dbTransaction.commit()
  } catch (error) {
    console.error(error)
    await dbTransaction.rollback()
    return response.res200(res, "001", "Terjadi kesalahan update data quantity cart item")
  }

  const dbTransaction2 = await db.transaction()
  try {
    const getTotalAmount = await shoppingCartModule.getUserCartItemPrice(req.body.session_id)
    console.log(getTotalAmount)

    const totalAmount = getTotalAmount.reduce((accumulator, object) => {
      return accumulator + object['product.price'] * object.quantity;
    }, 0);

    await shoppingCartModule.updateTotalAmountShoppingSession(dbTransaction2, req.body.session_id, totalAmount)
    await dbTransaction2.commit()
    return response.res200(res, "000", "Sukses update data shopping cart")
  } catch (error) {
    console.error(error)
    await dbTransaction2.rollback()
    return response.res200(res, "001", "Terjadi kesalahan update data shopping session")
  }
}

exports.getProductById = async (req, res, next) => {
  if (!req.query.id) return response.res400(res, "ID harus diisi.")
  const resProduct = await productModule.getProductById(req.query.id);
  
  if (!resProduct) return response.res200(res, "001", `Product dengan id ${req.query.id} tidak dapat ditemukan.`)
  return response.res200(res, "000", `Sukses mendapatkan product dengan id ${req.query.id}`, resProduct);
}

exports.insertProduct = async (req, res, next) => {
  let payload = {
    name: req.body.name,
    price: +req.body.price,
    stock: +req.body.stock,
    description: req.body.description,
    image: req.body.image
  }

  if (!payload.name) return response.res400(res, "Nama produk harus diisi.")
  if (!payload.price) return response.res400(res, "Harga produk harus diisi dan tidak boleh 0.")
  if (payload.stock === undefined || payload.stock === null) return response.res400(res, "Stock produk harus diisi.")
  if (!payload.description) return response.res400(res, "Deskripsi produk harus diisi.")

  const dbTransaction = await db.transaction()
  try {
    payload.id = nanoid(25)
    payload.created_date = new Date()
    payload.updated_date = new Date()

    await productModule.insertProduct(payload)
    dbTransaction.commit()
    return response.res200(res, "000", "Sukses insert produk baru")
  } catch (error) {
    console.error(error)
    dbTransaction.rollback()
    return response.res200(res, "001", "Terjadi kesalahan ketika insert database.")
  }
}