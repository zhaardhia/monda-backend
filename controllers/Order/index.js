"use strict";

const response = require("../../components/response")
// const productModule = require("./product.module")
const shoppingCartModule = require("../ShoppingCart/shoppingCart.module")
const orderModule = require("./order.module")
const axios = require("axios")
const { db } = require("../../components/database")
const bcrypt = require("bcrypt")
const { nanoid } = require('nanoid');
const jwt = require("jsonwebtoken")
const midtransClient = require('midtrans-client');
const { orderCreated } = require("../../libs/email")

// Create Core API instance
// const coreApi = new midtransClient.CoreApi({
//   isProduction : false, // DEPENDS ON NODE_ENV VALUE
//   serverKey : process.env.MIDTRANS_SERVER_KEY_SANDBOX,
//   clientKey : process.env.MIDTRANS_CLIENT_KEY_SANDBOX
// });

exports.orderProduct = async (req, res, next) => {
  const payload = {
    user_id: req.body.user_id,
    payment_type: req.body.payment_type,
    provider: req.body.provider
  }
  if (!payload.provider) return response.res400(res, "Pilih bank transfer sebelum melakukan proses checkout.")

  const recapShopSession = await orderModule.getShoppingSessionToOrder(payload.user_id);
  if (!recapShopSession) return response.res400(res, "no cart.")
  if (!recapShopSession.delivery_location || !recapShopSession.city || !recapShopSession.postal_code) return response.res400(res, "Alamat Pengiriman Harus Lengkap.")
  if (!recapShopSession.courier_id) return response.res400(res, "Kurir harus dipilih terlebih dahulu.")

  const resUser = await orderModule.getUserTransaction(recapShopSession.user_id)
  const recapUserItem = await orderModule.getCartItemToOrder(recapShopSession.id)
  console.log(recapUserItem)

  for (const item of recapUserItem) {
    if (item.quantity > item['product.stock']) return response.res400(res, `Stock tidak cukup pada produk ${item["product.name"]}`)
  }

  const dbTransactionOrder = await db.transaction()
  try {
    const orderNumber = await orderModule.getNumberOrder(payload.user_id)
    const orderCourier = await orderModule.getCourierById(recapShopSession.courier_id)
    const orderId = nanoid(20)
    const payloadOrder = {
      transaction: dbTransactionOrder,
      id: orderId,
      order_no: orderNumber.length < 1 ? 1 : orderNumber[0].order_no + 1,
      user_id: recapShopSession.user_id,
      gross_amount: recapShopSession.total_amount,
      address: recapShopSession.delivery_location,
      courier: orderCourier.name,
      status_order: "not_paid",
      delivery_fee: orderCourier.fee,
      transfer_fee: 4000, // HARDCODED,
      created_date: new Date(),
      updated_date: new Date()
    }

    await orderModule.createOrder(payloadOrder)

    for (const userItem of recapUserItem) {
      const payloadUserItem = {
        transaction: dbTransactionOrder,
        id: nanoid(20),
        order_id: orderId,
        product_id: userItem['product.id'],
        quantity: userItem.quantity,
        total_amount: userItem['product.price'] * userItem.quantity,
        created_date: new Date(),
        updated_date: new Date()
      }

      await orderModule.createOrderItem(payloadUserItem)
    }

    const payloadCharge = {
      payment_type: payload.payment_type,
      transaction_details: {
        order_id: orderId,
        gross_amount: recapShopSession.total_amount + orderCourier.fee + 4000
      },
      bank_transfer:{
        bank: payload.provider
      },
      customer_details: { 
        first_name: resUser.first_name,
        last_name: resUser.last_name,
        email: resUser.email,
        phone: resUser.phone
      }
    }

    let chargePayment;

    try {
      chargePayment = await axios.post(`${process.env.THIS_SERVICE_HOST}/api/v1/payment/charge`, payloadCharge);
      console.log({chargePayment})
      for (const userItem of recapUserItem) {
        await orderModule.updateProductStock(userItem['product.id'], userItem['product.stock'] - userItem.quantity)
      }
      await orderModule.deleteCartItem(recapShopSession.id)
      await orderModule.deleteShoppingSession(recapShopSession.id)
      
      const { statusCode, message, data } = chargePayment.data
      console.log({statusCode}, {message}, {data})

      orderCreated(resUser.email, data.order_id, "order_created")

      return response.res200(res, statusCode, message, data)
    } catch (error) {
      console.error(error)
      return response.res200(res, "001", "error while charge payment.", error)
    }
  } catch (error) {
    console.error(error);
    return response.res200(res, "001", "charge payment error", error)
  }
}

exports.verifiedPayment = async (req, res, next) => {
  if (!req.body.order_id) return response.res400(res, "required order_id")
  try {
    await orderModule.updateStatusOrder(req.body.order_id, "paid_verified")
    return response.res200(res, "000", "Sukses memverifikasi pembayaran.")
  } catch (error) {
    console.error(error)
    return response.res200(res, "001", "Gagal memverifikasi pembayaran. cek sistem / database.")
  }
}

exports.processToShipment = async (req, res, next) => {
  if (!req.body.order_id) return response.res400(res, "required order_id")
  if (!req.body.resi) return response.res400(res, "required resi")

  try {
    await orderModule.updateStatusOrder(req.body.order_id, "shipment")
    await orderModule.updateResiOrder(req.body.order_id, req.body.resi)

    return response.res200(res, "000", "Sukses memproses pengiriman produk.")
  } catch (error) {
    console.error(error)
    return response.res200(res, "001", "Gagal memproses pengiriman produk. cek sistem / database.")
  }
}

exports.doneOrder = async (req, res, next) => {
  if (!req.body.order_id) return response.res400(res, "required order_id")
  try {
    await orderModule.updateStatusOrder(req.body.order_id, "completed")
    return response.res200(res, "000", "Order telah selesai dikirim.")
  } catch (error) {
    console.error(error)
    return response.res200(res, "001", "Gagal update status order. cek sistem / database.")
  }
}

exports.userListOrder = async (req, res, next) => {
  if (!req.query.user_id) return response.res400(res, "user_id required.")
  const status_order = req.query.status_order;
  const orderBy = [req.query.order, req.query.orderType ? req.query.orderType : "DESC"]

  const resListOrder = await orderModule.getListOrderByUserId(req.query.user_id, status_order, orderBy)
  console.log({resListOrder})
  if (resListOrder.length < 1) return response.res200(res, "001", "Order masih kosong.")
  return response.res200(res, "000", "Sukses mengembalikan data list order", resListOrder)
}

exports.userOrderDetail = async (req, res, next) => {
  if (!req.query.order_id) return response.res400(res, "order_id required.")
  console.log(req.query.order_id)
  const resOrder = await orderModule.getOrderByUserId(req.query.order_id)

  if (!resOrder) return response.res200(res, "001", "Order masih kosong.")
  console.log({resOrder})
  const resOrderDetail = await orderModule.getOrderDetailByOrderId(req.query.order_id)
  const responseOrderDetail = {
    ...resOrder,
    order_detail: resOrderDetail
  }

  return response.res200(res, "000", "Sukses mengembalikan data list order", responseOrderDetail)
}


// {"status_code":"201","status_message":"Success, Bank Transfer transaction is created","transaction_id":"16dfea06-b8dd-4fec-933c-7836d92dd222","order_id":"-azUWSM49gEfoVerFgN5","merchant_id":"G353320930","gross_amount":"213000.00","currency":"IDR","payment_type":"bank_transfer","transaction_time":"2023-05-28 16:15:01","transaction_status":"pending","fraud_status":"accept","va_numbers":[{"bank":"bca","va_number":"20930679745"}],"expiry_time":"2023-05-29 16:15:01"}