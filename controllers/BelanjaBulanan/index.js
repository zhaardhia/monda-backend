"use strict";

const response = require("../../components/response")
const belanjaBulanan = require(".//belanjaBulanan.module")
const { db } = require("../../components/database")
const bcrypt = require("bcrypt")
const { nanoid } = require('nanoid');
const jwt = require("jsonwebtoken")

exports.getUserListBelanjaBulanan = async (req, res, next) => {
  const payload = {
    user_id: req.query.user_id
  }
  if (!payload.user_id) return response.res400(res, "user_id is required.")

  const resScheduler = await belanjaBulanan.getSchedulerBelanja(payload.user_id)
  if (!resScheduler) return response.res200(res, "000", "Belum ada list produk reminder belanja bulanan.")
  const resListSchedulerItem = await belanjaBulanan.getAllSchedulerBelanjaItem(resScheduler.id)
  console.log({resListSchedulerItem})
  const responseScheduler = {
    ...resScheduler,
    scheduler_item: resListSchedulerItem
  }
  return response.res200(res, "000", "Sukses mendapatkan data kurir", responseScheduler);
}

exports.getItemBelanjaBulanan = async (req, res, next) => {
  const payload = {
    user_id: req.query.user_id,
    product_id: req.query.product_id
  }

  if (!payload.user_id) return response.res400(res, "user_id is required.")
  if (!payload.product_id) return response.res400(res, "product is required.")

  const resScheduler = await belanjaBulanan.getSchedulerBelanja(payload.user_id)
  if (!resScheduler) return response.res200(res, "000", "Item belum masuk ke list belanja bulanan", { flag: false })

  const resItem = await belanjaBulanan.getSchedulerBelanjaItem(resScheduler.id, payload.product_id)
  if (!resItem) return response.res200(res, "000", "Item belum masuk ke list belanja bulanan", { flag: false })

  else return response.res200(res, "000", "Item sudah masuk ke list belanja bulanan", { flag: true })
}

exports.addProductToBelanjaBulanan = async (req, res, next) => {
  const payload = {
    user_id: req.body.user_id,
    product_id: req.body.product_id
  }
  const resSchedulerBelanja = await belanjaBulanan.getSchedulerBelanja(payload.user_id)

  if (!resSchedulerBelanja) {
    const schedulerId = nanoid(10)
    const schedulerItemId = nanoid(10)
    const dbTransaction = await db.transaction()
    try {
      await belanjaBulanan.insertSchedulerBelanja(
        {
          transaction: dbTransaction,
          id: schedulerId,
          user_id: payload.user_id,
          created_date: new Date(),
          updated_date: new Date()
        }
      )

      await belanjaBulanan.insertSchedulerBelanjaItem(
        {
          transaction: dbTransaction,
          id: schedulerItemId,
          scheduler_belanja_id: schedulerId,
          product_id: payload.product_id
        }
      )
      await dbTransaction.commit()
      return response.res200(res, "000", "Sukses menambahkan produk kedalam list reminder belanja bulanan");
    } catch (error) {
      console.error(error)
      await dbTransaction.rollback()
      return response.res400(res, "Terjadi kesalahan ketika menambahkan produk kedalam list reminder belanja bulanan.")
    }
  } else {
    const dbTransaction = await db.transaction()
    try {
      await belanjaBulanan.insertSchedulerBelanjaItem(
        {
          transaction: dbTransaction,
          id: nanoid(10),
          scheduler_belanja_id: resSchedulerBelanja.id,
          product_id: payload.product_id
        }
      )
      const payloadItem = {
        updated_date: new Date()
      }
      await belanjaBulanan.updateSchedulerBelanja(dbTransaction, payloadItem, resSchedulerBelanja.id)
      await dbTransaction.commit()
      return response.res200(res, "000", "Sukses menambahkan produk kedalam list reminder belanja bulanan");
    } catch (error) {
      console.error(error)
      await dbTransaction.rollback()
      return response.res400(res, "Terjadi kesalahan ketika menambahkan produk kedalam list reminder belanja bulanan.")
    }
  }
}

exports.removeProductFromBelanjaBulanan = async (req, res, next) => {
  const payload = {
    user_id: req.body.user_id,
    product_id: req.body.product_id
  }

  const resSchedulerBelanja = await belanjaBulanan.getSchedulerBelanja(payload.user_id)
  if (!resSchedulerBelanja) return response.res400(res, "data belanja bulananmu tidak terdeteksi dalam database")

  const payloadItem = {
    updated_date: new Date()
  }
  const dbTransaction = await db.transaction()
  try {
    await belanjaBulanan.deleteSchedulerBelanjaItem(payload.product_id, resSchedulerBelanja.id)
    await belanjaBulanan.updateSchedulerBelanja(dbTransaction, payloadItem, resSchedulerBelanja.id)
    await dbTransaction.commit()
    return response.res200(res, "000", "Sukses menghapus produk dari list reminder belanja bulanan");
  } catch (error) {
    console.error(error)
    await dbTransaction.rollback()
    return response.res400(res, "Terjadi kesalahan ketika menghapus produk dari list reminder belanja bulanan.")
  }
}

exports.editScheduler = async (req, res, next) => {
  const payload = {
    user_id: req.body.user_id,
    status: +req?.body?.status,
    date: +req?.body?.date,
    hour: +req?.body?.hour
  }

  if (!payload.user_id) return response.res400(res, "user_id is required.")
  if (payload.status === null || payload.status === undefined) return response.res400(res, "status is required.")

  const resScheduler = await belanjaBulanan.getSchedulerBelanja(payload.user_id)
  if (!resScheduler) {
    await belanjaBulanan.insertSchedulerBelanja({
      id: nanoid(10),
      user_id: payload.user_id,
      date: payload.date,
      hour: payload.hour,
      status: payload.status
    })
    return response.res200(res, "000", "Sukses menambahkan/mengubah data scheduler")
  } else {
    const dbTransaction = await db.transaction()
    try {
      const payloadScheduler = {
        date: payload.date,
        hour: payload.hour,
        status: payload.status
      }
      await belanjaBulanan.updateSchedulerBelanja(dbTransaction, payloadScheduler, resScheduler.id)
      await dbTransaction.commit()
      return response.res200(res, "000", "Sukses menambahkan/mengubah data scheduler")
    } catch (error) {
      console.error(error)
      await dbTransaction.rollback()
      return response.res400(res, "Gagal menambahkan/mengubah data scheduler. Silahkan hubungi CS")
    }
  }
}