"use strict";

const sequelize = require("sequelize");
const Sequelize = require("sequelize")
const { db } = require("../../components/database")
const { Op } = sequelize;
const { 
	scheduler_belanja,
  scheduler_belanja_item,
  product
} = require("../../components/database");

exports.insertSchedulerBelanja = async (payload) => {
  return scheduler_belanja.create(payload)
}

exports.insertSchedulerBelanjaItem = async (payload) => {
  return scheduler_belanja_item.create(payload)
}

exports.deleteSchedulerBelanja = async (id) => {
  return scheduler_belanja.destroy({
    where: {
      id
    }
  })
}

exports.deleteSchedulerBelanjaItem = async (product_id, scheduler_belanja_id) => {
  return scheduler_belanja_item.destroy({
    where: {
      product_id,
      scheduler_belanja_id
    }
  })
}

exports.updateSchedulerBelanja = async (dbTransaction, payload, id) => {
  return scheduler_belanja.update(
    payload,
    {
      where: {
        id
      },
      transaction: dbTransaction
    }
  )
}

exports.getSchedulerBelanja = async (user_id) => {
  return scheduler_belanja.findOne({
    raw: true,
    where: {
      user_id
    }
  })
}

exports.getSchedulerBelanjaItem = async (scheduler_belanja_id, product_id) => {
  return scheduler_belanja_item.findOne({
    raw: true,
    where: {
      scheduler_belanja_id,
      product_id
    }
  })
}

exports.getAllSchedulerBelanjaItem = async (scheduler_belanja_id) => {
  const productAssociate = scheduler_belanja_item.hasOne(product, {foreignKey: "id", sourceKey: "product_id"})
  return scheduler_belanja_item.findAll({
    raw: true,
    include: [
      {
        association: productAssociate,
        attributes: ["id", "name", "price", "image", "stock"],
        required: false,
      },
    ],
    where: {
      scheduler_belanja_id
    }
  })
}