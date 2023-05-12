"use strict";

const response = require("../../components/response")
// const productModule = require("./product.module")
// const shoppingCartModule = require("../ShoppingCart/shoppingCart.module")
const { db, payment_order, order } = require("../../components/database")
const bcrypt = require("bcrypt")
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
  coreApi.charge(req.body)
    .then(async (chargeResponse)=>{
      console.log('chargeResponse:',JSON.stringify(chargeResponse));

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

      return response.res200(res, chargeResponse.status_code, chargeResponse.status_message, { 
        transaction_id: payloadPaymentCreated.id,
        order_id: chargeResponse.order_id,
        amount: chargeResponse.gross_amount,
        payment_type: chargeResponse.payment_type,
        provider: chargeResponse.va_numbers[0].bank,
        status: chargeResponse.transaction_status,
        va_number: chargeResponse.va_numbers[0].va_number,
      })
    })
    .catch((e)=>{
      console.log('Error occured:',e.message);
      return response.res400(res, "Error charge payment / inserting payment data to database.")
    });;
}

exports.callbackNotificationPayment = async (req, res, next) => {
  coreApi.transaction.notification(req.body)
    .then(async (statusResponse)=>{
      let orderId = statusResponse.order_id;
      let transactionStatus = statusResponse.transaction_status;
      let fraudStatus = statusResponse.fraud_status;

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