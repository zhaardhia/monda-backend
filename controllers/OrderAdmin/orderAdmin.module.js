"use strict";

const sequelize = require("sequelize");
const Sequelize = require("sequelize")
const { Op } = sequelize;
const { 
	db,
  order,
  user
} = require("../../components/database");

exports.getLatestTransaction = async () => {
  const userAssociate = order.hasOne(user, {foreignKey: "id", sourceKey: "user_id"})
  return order.findAll({
    raw: true,
    include: [
      {
        association: userAssociate,
        required: true,
        attributes: ["id", "fullname"]
      }
    ],
    order: [
      ['created_date', 'DESC'],
    ],
    limit: 3,
  })
}

exports.getThisMonthsIncome = async (from, to) => {
  return order.findAll({
    raw: true,
    where: {
      created_date: {
        [Op.between] : [from, to]
      }
    }
  })
}