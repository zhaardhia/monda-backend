"use strict";

const response = require("../../components/response")
const userModule = require("./user.module")
const { db } = require("../../components/database")
const bcrypt = require("bcrypt")
const { nanoid } = require('nanoid');
const jwt = require("jsonwebtoken")

exports.getAllUidWithNoOss = async (req, res, next) => {
  const resAllUser = await userModule.getAllUserImageInfo()
  // if (resAllUser.length < 1) return response.res400(res, "")
  return response.res200(res, "000", "Success get all user", resAllUser)
}

exports.registerUser = async (req, res, next) => {
  const { email, first_name, last_name, fullname, password, confPassword, role } = req.body
  if (password !== confPassword) return response.res400(res, "Password dan Confirm Password tidak cocok.")

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  const payload = {
    id: nanoid(25),
    email,
    first_name,
    last_name, 
    fullname, 
    password: hashPassword,
    role
  }
  console.log(payload)
  try {
    await userModule.registerPassword(payload)
    return response.res200(res, "000", "Register Berhasil.")
  } catch (error) {
    console.error(error)
    return response.res200(res, "001", "Register Gagal. Mohon cek kembali data user yang dibuat.")
  }
}

exports.login = async (req, res, next) => {
  const payload = {
    email: req.body.email,
    password: req.body.password
  }

  if (!payload.email) return response.res400(res, "Email harus diisi.")
  if (!payload.password) return response.res400(res, "Password harus diisi.")

  
  const user = await userModule.getUserByEmail(payload.email);
  if (!user) return response.res200(res, "001", "Email tidak ditemukan.");

  const match = await bcrypt.compare(payload.password, user.password)
  if (!match) return response.res200(res, "001", "Password salah.")

  const userId = user.id
  const name = user.fullname
  const email = user.email
  const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '20s'
  })

  const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '1d'
  })

  try {
    await userModule.updateRefreshToken(userId, refreshToken)
  } catch (error) {
    console.error(error)
  }

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    // secure: true
  })
  return response.res200(res, "000", "Login Berhasil.", accessToken)
}

exports.refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken, req)
    if (!refreshToken) return response.res401(res)

    const user = await userModule.getRefreshToken(refreshToken);
    if (!user[0]) return response.res401(res);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, decoded) => {
      if (error) return response.res401(res)
      const { id: userId, email, fullname: name } = user[0]
      const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15s'
      })

      return response.res200(res, "000", "Success generate token.", accessToken);
    })
  } catch (error) {
    console.error(error)
  }
}

exports.logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken, req)
    if (!refreshToken) return response.res200("001", "No content")

    const user = await userModule.getRefreshToken(refreshToken);
    if (!user[0]) return response.res200("001", "No content")

    const userId = user[0].id

    await userModule.updateRefreshToken(userId, null)
    
    res.clearCookie('refreshToken')
    return response.res200(res, "000", "Berhasil Logout.")
  } catch (error) {
    console.error(error)
  }
}