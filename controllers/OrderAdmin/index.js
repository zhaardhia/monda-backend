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
  const resTransaction = await orderAdminModule.getThisMonthsIncome(moment().subtract(1, 'months'), new Date())
  if (resTransaction.length < 1) return response.res400(res, "Transaksi tidak ditemukan")
  console.log(resTransaction, " WKKWKWKW")

  const filter1to5 = resTransaction.filter((data) => {
    return new Date(data.created_date).getTime() >= new Date(moment().subtract(29, 'days').format("YYYY-MM-DD")).getTime() 
      && new Date(data.created_date).getTime() <= new Date(moment().subtract(25, 'days').format("YYYY-MM-DD")).getTime()
  })

  const filter6to10 = resTransaction.filter((data) => {
    return new Date(data.created_date).getTime() >= new Date(moment().subtract(24, 'days').format("YYYY-MM-DD")).getTime() 
      && new Date(data.created_date).getTime() <= new Date(moment().subtract(20, 'days').format("YYYY-MM-DD")).getTime()
  })

  const filter11to15 = resTransaction.filter((data) => {
    return new Date(data.created_date).getTime() >= new Date(moment().subtract(19, 'days').format("YYYY-MM-DD")).getTime() 
      && new Date(data.created_date).getTime() <= new Date(moment().subtract(15, 'days').format("YYYY-MM-DD")).getTime()
  })

  const filter16to20 = resTransaction.filter((data) => {
    return new Date(data.created_date).getTime() >= new Date(moment().subtract(14, 'days').format("YYYY-MM-DD")).getTime() 
      && new Date(data.created_date).getTime() <= new Date(moment().subtract(10, 'days').format("YYYY-MM-DD")).getTime()
  })

  const filter21to25 = resTransaction.filter((data) => {
    return new Date(data.created_date).getTime() >= new Date(moment().subtract(9, 'days').format("YYYY-MM-DD")).getTime() 
      && new Date(data.created_date).getTime() <= new Date(moment().subtract(5, 'days').format("YYYY-MM-DD")).getTime()
  })

  const filter26to30 = resTransaction.filter((data) => {
    return new Date(data.created_date).getTime() >= new Date(moment().subtract(4, 'days').format("YYYY-MM-DD")).getTime() 
      && new Date(data.created_date).getTime() <= new Date(moment().subtract(0, 'days').format("YYYY-MM-DD")).getTime()
  })

  console.log({filter21to25}, {filter26to30})

  const responseData = [
    {
      periode: "1 - 5",
      amount: filter1to5.reduce((accumulator, object) => {
        return accumulator + +object.gross_amount;
      }, 0),
      from: moment().subtract(29, 'days').format("LL"),
      to: moment().subtract(25, 'days').format("LL"),
    },
    {
      periode: "6 - 10",
      amount: filter6to10.reduce((accumulator, object) => {
        return accumulator + +object.gross_amount;
      }, 0),
      from: moment().subtract(24, 'days').format("LL"),
      to: moment().subtract(20, 'days').format("LL"),
    },
    {
      periode: "11 - 15",
      amount: filter11to15.reduce((accumulator, object) => {
        return accumulator + +object.gross_amount;
      }, 0),
      from: moment().subtract(19, 'days').format("LL"),
      to: moment().subtract(15, 'days').format("LL"),
    },
    {
      periode: "16 - 20",
      amount: filter16to20.reduce((accumulator, object) => {
        return accumulator + +object.gross_amount;
      }, 0),
      from: moment().subtract(14, 'days').format("LL"),
      to: moment().subtract(10, 'days').format("LL"),
    },
    {
      periode: "21 - 25",
      amount: filter21to25.reduce((accumulator, object) => {
        return accumulator + +object.gross_amount;
      }, 0),
      from: moment().subtract(9, 'days').format("LL"),
      to: moment().subtract(5, 'days').format("LL"),
    },
    {
      periode: "26 - 30",
      amount: filter26to30.reduce((accumulator, object) => {
        return accumulator + +object.gross_amount;
      }, 0),
      from: moment().subtract(4, 'days').format("LL"),
      to: moment().format("LL"),
    },
  ]
  return response.res200(res, "000", "Sukses mengambil data transaksi user", responseData)
}