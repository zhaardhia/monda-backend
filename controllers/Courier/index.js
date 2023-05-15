"use strict";

const response = require("../../components/response")
const courierModule = require("./courier.module")
const { db } = require("../../components/database")
const bcrypt = require("bcrypt")
const { nanoid } = require('nanoid');
const jwt = require("jsonwebtoken")

exports.getAllCourier = async (req, res, next) => {
  const resAllCourier = await courierModule.getAllCourier()
  if (resAllCourier.length < 1) return response.res200(res, "001", "Courier not found.")
  return response.res200(res, "000", "Sukses mendapatkan data kurir", resAllCourier);
}