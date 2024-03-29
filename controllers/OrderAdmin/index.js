"use strict";

const response = require("../../components/response")
// const productModule = require("./product.module")
// const shoppingCartModule = require("../ShoppingCart/shoppingCart.module")
const orderAdminModule = require("./orderAdmin.module")
const axios = require("axios")
const { db } = require("../../components/database")
const bcrypt = require("bcrypt")
const { nanoid } = require('nanoid');
const jwt = require("jsonwebtoken")
const moment = require("moment")

exports.getLatestTransaction = async (req, res, next) => {
  const resTransaction = await orderAdminModule.getLatestTransaction()
  if (resTransaction.length < 1) return response.res400(res, "Transaksi tidak ditemukan")
  console.log({ resTransaction })
  return response.res200(res, "000", "Sukses mengambil data transaksi user", resTransaction)
}

exports.getThisMonthsIncome = async (req, res, next) => {
  const resTransaction = await orderAdminModule.getThisMonthsIncome(moment().subtract(30, 'days').tz('Asia/Jakarta'), moment(new Date()).subtract(0, 'days').tz('Asia/Jakarta'))
  console.log("TANGGALL:", moment(new Date()).subtract(1, 'months'), new Date())
  console.log(resTransaction, " WKKWKWKW")
  console.log({ arggg: moment(new Date()).subtract(0, 'days').tz('Asia/Jakarta')})
  if (resTransaction.length < 1) return response.res400(res, "Transaksi tidak ditemukan")

  const filter1to5 = resTransaction.filter((data) => {
    return new Date(data.created_date).getTime() >= new Date(moment().subtract(29, 'days').tz('Asia/Jakarta').format("YYYY-MM-DD")).getTime() 
      && new Date(data.created_date).getTime() <= new Date(moment().subtract(25, 'days').tz('Asia/Jakarta').format("YYYY-MM-DD")).getTime()
  })

  const filter6to10 = resTransaction.filter((data) => {
    return new Date(moment(data.created_date).tz('Asia/Jakarta').format("YYYY-MM-DD")).getTime() >= new Date(moment().subtract(24, 'days').tz('Asia/Jakarta').format("YYYY-MM-DD")).getTime() 
      && new Date(moment(data.created_date).tz('Asia/Jakarta').format("YYYY-MM-DD")).getTime() <= new Date(moment().subtract(20, 'days').tz('Asia/Jakarta').format("YYYY-MM-DD")).getTime()
  })

  const filter11to15 = resTransaction.filter((data) => {
    return new Date(moment(data.created_date).tz('Asia/Jakarta').format("YYYY-MM-DD")).getTime() >= new Date(moment().subtract(19, 'days').tz('Asia/Jakarta').format("YYYY-MM-DD")).getTime() 
      && new Date(moment(data.created_date).tz('Asia/Jakarta').format("YYYY-MM-DD")).getTime() <= new Date(moment().subtract(15, 'days').tz('Asia/Jakarta').format("YYYY-MM-DD")).getTime()
  })

  const filter16to20 = resTransaction.filter((data) => {
    return new Date(data.created_date).getTime() >= new Date(moment().subtract(14, 'days').tz('Asia/Jakarta').format("YYYY-MM-DD")).getTime() 
      && new Date(data.created_date).getTime() <= new Date(moment().subtract(10, 'days').tz('Asia/Jakarta').format("YYYY-MM-DD")).getTime()
  })

  const filter21to25 = resTransaction.filter((data) => {
    return new Date(moment(data.created_date).tz('Asia/Jakarta').format("YYYY-MM-DD")).getTime() >= new Date(moment().subtract(9, 'days').tz('Asia/Jakarta').format("YYYY-MM-DD")).getTime() 
      && new Date(data.created_date).getTime() <= new Date(moment().subtract(5, 'days').tz('Asia/Jakarta').format("YYYY-MM-DD")).getTime()
  })

  const filter26to30 = resTransaction.filter((data) => {
    return new Date(data.created_date).getTime() >= new Date(moment().subtract(4, 'days').tz('Asia/Jakarta').format("YYYY-MM-DD")).getTime() 
      && new Date(moment(data.created_date).tz('Asia/Jakarta').format("YYYY-MM-DD")).getTime() <= new Date(moment().subtract(0, 'days').tz('Asia/Jakarta').format("YYYY-MM-DD")).getTime()
  })

  console.log({filter21to25}, {filter26to30})

  const responseData = [
    {
      periode: "1 - 5",
      amount: filter1to5.reduce((accumulator, object) => {
        return accumulator + +object.gross_amount;
      }, 0),
      from: moment().subtract(29, 'days').tz('Asia/Jakarta').format("DD MMMM"),
      to: moment().subtract(25, 'days').tz('Asia/Jakarta').format("DD MMMM"),
    },
    {
      periode: "6 - 10",
      amount: filter6to10.reduce((accumulator, object) => {
        return accumulator + +object.gross_amount;
      }, 0),
      from: moment().subtract(24, 'days').tz('Asia/Jakarta').format("DD MMMM"),
      to: moment().subtract(20, 'days').tz('Asia/Jakarta').format("DD MMMM"),
    },
    {
      periode: "11 - 15",
      amount: filter11to15.reduce((accumulator, object) => {
        return accumulator + +object.gross_amount;
      }, 0),
      from: moment().subtract(19, 'days').tz('Asia/Jakarta').format("DD MMMM"),
      to: moment().subtract(15, 'days').tz('Asia/Jakarta').format("DD MMMM"),
    },
    {
      periode: "16 - 20",
      amount: filter16to20.reduce((accumulator, object) => {
        return accumulator + +object.gross_amount;
      }, 0),
      from: moment().subtract(14, 'days').tz('Asia/Jakarta').format("DD MMMM"),
      to: moment().subtract(10, 'days').tz('Asia/Jakarta').format("DD MMMM"),
    },
    {
      periode: "21 - 25",
      amount: filter21to25.reduce((accumulator, object) => {
        return accumulator + +object.gross_amount;
      }, 0),
      from: moment().subtract(9, 'days').tz('Asia/Jakarta').format("DD MMMM"),
      to: moment().subtract(5, 'days').tz('Asia/Jakarta').format("DD MMMM"),
    },
    {
      periode: "26 - 30",
      amount: filter26to30.reduce((accumulator, object) => {
        return accumulator + +object.gross_amount;
      }, 0),
      from: moment().subtract(4, 'days').tz('Asia/Jakarta').format("DD MMMM"),
      to: moment().tz('Asia/Jakarta').format("DD MMMM"),
    },
  ]
  return response.res200(res, "000", "Sukses mengambil data transaksi user", responseData)
}

exports.userOrderDetail = async (req, res, next) => {
  if (!req.query.order_id) return response.res400(res, "order_id required.")
  console.log(req.query.order_id)
  const resOrder = await orderAdminModule.getOrderByUserId(req.query.order_id)

  if (!resOrder) return response.res200(res, "001", "Order masih kosong.")

  const resOrderDetail = await orderAdminModule.getOrderDetailByOrderId(req.query.order_id)
  const responseOrderDetail = {
    ...resOrder,
    order_detail: resOrderDetail
  }

  return response.res200(res, "000", "Sukses mengembalikan data list order", responseOrderDetail)
}

exports.getListOrder = async (req, res, next) => {
  const status_order = req.query.status_order;
  const orderBy = [req.query.order, req.query.orderType ? req.query.orderType : "DESC"]

  const resOrder = await orderAdminModule.getListOrder(status_order, orderBy)
  if (resOrder.length < 1) return response.res200(res, "001", "Belum ada transaksi masuk", [])
  return response.res200(res, "000", "Sukses mengambil data semua transaksi.", resOrder)
}

exports.getListOrderShipment = async (req, res, next) => {
  const resOrder = await orderAdminModule.getListPengiriman()
  if (resOrder.length < 1) return response.res400(res, "Belum ada pengiriman.")
  return response.res200(res, "000", "Sukses mengambil data semua transaksi.", resOrder)
}