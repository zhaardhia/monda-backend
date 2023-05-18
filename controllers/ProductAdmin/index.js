"use strict";

const response = require("../../components/response")
const productAdminModule = require("./productAdmin.module")
const { db } = require("../../components/database")
const bcrypt = require("bcrypt")
const { nanoid } = require('nanoid');
const jwt = require("jsonwebtoken")
const { validationEmail } = require("../../middlewares/validator")

exports.getThreeBestSellerProduct = async (req, res, next) => {
  const resOrderItem = await productAdminModule.get3BestSellerProduct()
  console.log(resOrderItem)
  if (resOrderItem.length < 1) return response.res400(res, "Belum ada product yang terjual")

  let result = []
  for (const item of resOrderItem) {
    const resProductDetail = await productAdminModule.getProductDetail(item.product_id)
    result.push({
      ...item,
      ...resProductDetail
    })
  }
  return response.res200(res, "000", "Sukses mengambil data produk yang paling laris.", result)
}

exports.getAllProducts = async (req, res, next) => {
  const resProducts = await productAdminModule.getAllProducts()
  if (resProducts.length < 1) return response.res400(res, "Produk tidak ditemukan")

  return response.res200(res, "000", "Sukses mengambil data semua produk", resProducts)
}