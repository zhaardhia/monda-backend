"use strict";

const sequelize = require("sequelize");
const Sequelize = require("sequelize")
const { db } = require("../../components/database")
const { Op } = sequelize;
const { 
	user
} = require("../../components/database");

exports.getAllUserImageInfo = async (uid) => {
  return user.findAll({
    raw: true,
    // where: {
    //   uid
    // },
    attributes: ["id", "email", "fullname", "first_name", "last_name", "address", "role"]
  })
}

exports.getUserById = async (id) => {
  return user.findOne({
    raw: true,
    where: {
      id
    },
    attributes: ["id", "email", "fullname", "first_name", "last_name", "address", "role"]
  })
}

exports.registerPassword = async (payload) => {
  return user.create(
    payload
  )
}

exports.getUserByEmail = async (email) => {
  return user.findOne({
    raw:true,
    where: {
      email
    }
  })
}

exports.updateRefreshToken = async (userId, refresh_token) => {
  return user.update(
    {
      refresh_token
    },
    {
      where: {
        id: userId
      }
    }
  )
}

exports.getRefreshToken = async (refresh_token) => {
  return user.findAll({
    raw: true,
    where: {
      refresh_token
    }
  })
}