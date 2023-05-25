"use strict";

const response = require("../../components/response")
// const productModule = require("./product.module")
// const shoppingCartModule = require("../ShoppingCart/shoppingCart.module")
const { db, payment_order, order } = require("../../components/database")
const bcrypt = require("bcrypt")
const crypto = require('crypto');
const { nanoid } = require('nanoid');
const jwt = require("jsonwebtoken")
const midtransClient = require('midtrans-client');

// Create Core API instance
const coreApi = new midtransClient.CoreApi({
  isProduction : false, // DEPENDS ON NODE_ENV VALUE
  serverKey : process.env.MIDTRANS_SERVER_KEY_SANDBOX,
  clientKey : process.env.MIDTRANS_CLIENT_KEY_SANDBOX
});

exports.chargePayment = async (req, res, next) => {
  console.log({ request: req.body })
  coreApi.charge(req.body)
    .then(async (chargeResponse)=>{
      console.log('chargeResponse:',JSON.stringify(chargeResponse));

      if (process.env.THIS_SERVICE_HOST.includes("127.0.0.1")) {
        const payloadPaymentCreated = {
          id: chargeResponse.transaction_id,
          order_id: chargeResponse.order_id,
          amount: chargeResponse.gross_amount,
          payment_type: chargeResponse.payment_type,
          provider: chargeResponse.va_numbers[0].bank,
          status: chargeResponse.transaction_status,
          response_midtrans: JSON.stringify(chargeResponse),
          va_number: chargeResponse.va_numbers[0].va_number,
          expiry_time: chargeResponse.expiry_time,
          created_date: chargeResponse.transaction_time,
          updated_date: chargeResponse.transaction_time
        }
        await payment_order.create(payloadPaymentCreated)
        await order.update(
          {
            status_order: "not_paid",
            updated_date: new Date()
          },
          {
            where: {
              id: chargeResponse.order_id
            }
          }
        )
      }
      return response.res200(res, chargeResponse.status_code, chargeResponse.status_message, { 
        transaction_id: chargeResponse.transaction_id,
        order_id: chargeResponse.order_id,
        amount: chargeResponse.gross_amount,
        payment_type: chargeResponse.payment_type,
        provider: chargeResponse.va_numbers[0].bank,
        status: chargeResponse.transaction_status,
        va_number: chargeResponse.va_numbers[0].va_number,
      })
    })
    .catch((e)=>{
      console.error(e);
      console.error('Error occured:',e.message);
      return response.res400(res, "Error charge payment / inserting payment data to database.")
    });;
}

exports.callbackNotificationPayment = async (req, res, next) => {
  console.log({ request: req.body })
  coreApi.transaction.notification(req.body)
    .then(async (statusResponse)=>{
      console.log({ statusResponse })

      const order_id = statusResponse.order_id;
      const status_code = statusResponse.status_code;
      const gross_amount = statusResponse.gross_amount;
      const ServerKey = process.env.MIDTRANS_SERVER_KEY_SANDBOX;

      const dataToHash = order_id + status_code + gross_amount + ServerKey;

      // Create the SHA512 hash
      const hash = crypto.createHash('sha512').update(dataToHash).digest('hex');
      if (hash !== statusResponse.signature_key) return response.res401(res)

      let orderId = statusResponse.order_id;
      let transactionStatus = statusResponse.transaction_status;
      let fraudStatus = statusResponse.fraud_status;

      console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

      if (transactionStatus == 'pending') {
        const payloadPaymentCreated = {
          id: statusResponse.transaction_id,
          order_id: statusResponse.order_id,
          amount: statusResponse.gross_amount,
          payment_type: statusResponse.payment_type,
          provider: statusResponse.va_numbers[0].bank,
          status: statusResponse.transaction_status,
          response_midtrans: JSON.stringify(statusResponse),
          va_number: statusResponse.va_numbers[0].va_number,
          expiry_time: statusResponse.expiry_time,
          created_date: statusResponse.transaction_time,
          updated_date: statusResponse.transaction_time
        }
        await payment_order.create(payloadPaymentCreated)

        await order.update(
          {
            status_order: "not_paid",
            updated_date: new Date()
          },
          {
            where: {
              id: statusResponse.order_id
            }
          }
        )
        return response.res200(res, "000", "Success handle Charge Payment")
      } else if (transactionStatus == 'settlement') {
        await payment_order.update(
          {
            status: transactionStatus,
            response_midtrans: JSON.stringify(statusResponse),
            updated_date: new Date()
          },
          {
            where: {
              id: statusResponse.transaction_id
            }
          }
        )

        await order.update(
          {
            status_order: "paid_unverified",
            response_midtrans: JSON.stringify(statusResponse),
            updated_date: new Date()
          },
          {
            where: {
              id: statusResponse.order_id
            }
          }
        )
        return response.res200(res, "000", "Success handle Payment")
      } else if (transactionStatus == 'cancel' || transactionStatus == 'expire'){
        await payment_order.update(
          {
            status: transactionStatus,
            response_midtrans: JSON.stringify(statusResponse),
            updated_date: new Date()
          },
          {
            where: {
              id: statusResponse.transaction_id
            }
          }
        )

        await order.update(
          {
            status_order: `${transactionStatus}_payment`,   //  possible: cancel_payment || expire_payment
            updated_date: new Date()
          },
          {
            where: {
              id: statusResponse.order_id
            }
          }
        )
        return response.res200(res, "000", "Success cancel / expire Payment")
      }
  })
  .catch((e)=>{
    console.log('Error occured:',e.message);
    return response.res400(res, "Error charge payment / inserting payment data to database.")
  });;
}

exports.checkStatusPayment = async (req, res, next) => {
  console.log(req.query.transaction_id)
  coreApi.transaction.status(req.query.transaction_id)
    .then(async (statusResponse)=>{
      console.log({ statusResponse })
      let orderId = statusResponse.order_id;
      let transactionStatus = statusResponse.transaction_status;
      let fraudStatus = statusResponse.fraud_status;
      const status_code = statusResponse.status_code;
      const gross_amount = statusResponse.gross_amount;
      const ServerKey = process.env.MIDTRANS_SERVER_KEY_SANDBOX;

      const dataToHash = orderId + status_code + gross_amount + ServerKey;
      // Create the SHA512 hash
      const hash = crypto.createHash('sha512').update(dataToHash).digest('hex');
      if (hash !== statusResponse.signature_key) return response.res401(res)
      console.log({hash}, {sigKey: statusResponse.signature_key })
      console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

      await payment_order.update(
        {
          status: transactionStatus,
          response_midtrans: JSON.stringify(statusResponse),
          updated_date: new Date()
        },
        {
          where: {
            id: statusResponse.transaction_id
          }
        }
      )

      if (transactionStatus == 'settlement') {
        await order.update(
          {
            status_order: "paid_unverified",
            response_midtrans: JSON.stringify(statusResponse),
            updated_date: new Date()
          },
          {
            where: {
              id: statusResponse.order_id
            }
          }
        )
      } else if (transactionStatus == 'cancel' || transactionStatus == 'expire'){
        await order.update(
          {
            status_order: `${transactionStatus}_payment`,   //  possible: cancel_payment || expire_payment
            updated_date: new Date()
          },
          {
            where: {
              id: statusResponse.order_id
            }
          }
        )
      }
      
      return response.res200(res, statusResponse.status_code, statusResponse.status_message, statusResponse)
    })
    .catch((e)=>{
      console.log('Error occured:',e.message);
      return response.res400(res, "Error charge payment / inserting payment data to database.")
    });;
}

exports.cancelPayment = async (req, res, next) => {
  coreApi.transaction.cancel(req.query.transaction_id)
    .then(async (statusResponse)=>{
      console.log({ statusResponse })
      let orderId = statusResponse.order_id;
      let transactionStatus = statusResponse.transaction_status;
      let fraudStatus = statusResponse.fraud_status;

      console.log(`Transaction canceled. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

      await payment_order.update(
        {
          status: transactionStatus,
          response_midtrans: JSON.stringify(statusResponse),
          updated_date: new Date()
        },
        {
          where: {
            id: statusResponse.transaction_id
          }
        }
      )

      if (transactionStatus == 'settlement') {
        await order.update(
          {
            status_order: "paid_unverified",
            response_midtrans: JSON.stringify(statusResponse),
            updated_date: new Date()
          },
          {
            where: {
              id: statusResponse.order_id
            }
          }
        )
      } else if (transactionStatus == 'cancel' || transactionStatus == 'expire'){
        await order.update(
          {
            status_order: `${transactionStatus}_payment`,   //  possible: cancel_payment || expire_payment
            updated_date: new Date()
          },
          {
            where: {
              id: statusResponse.order_id
            }
          }
        )
      }
      
      return response.res200(res, statusResponse.status_code, "Sukses membatalkan transaksi.", statusResponse)
    })
    .catch((e)=>{
      console.log('Error occured:',e.message);
      return response.res400(res, "Error charge payment / inserting payment data to database.")
    });;
}

exports.getPaymentOrderById = async (req, res, next) => {
  if (!req.query.order_id) return response.res400(res, "order_id required.")

  const resPaymentOrder = await payment_order.findOne({
    raw: true,
    where: {
      order_id: req.query.order_id
    },
    attributes: ["id", "order_id", "amount", "payment_type", "provider", "status", "va_number", "expiry_time", "updated_date"]
  })
  if (!resPaymentOrder) response.res200(res, "001", "Payment order tidak ditemukan");
  return response.res200(res, "000", "Sukses mengambil data payment order", resPaymentOrder)
}