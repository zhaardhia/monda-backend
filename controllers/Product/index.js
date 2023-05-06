"use strict";

const response = require("../../components/response")
const productModule = require("./product.module")
const { db } = require("../../components/database")
const bcrypt = require("bcrypt")
const { nanoid } = require('nanoid');
const jwt = require("jsonwebtoken")

exports.getAllProducts = async (req, res, next) => {
  const resProducts = await productModule.getAllProducts();
  if (resProducts.length < 1) return response.res200(res, "001", "Tidak ada product yang tersedia")
  return response.res200(res, "000", "Berhasil mengembalikan data semua product", resProducts);
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