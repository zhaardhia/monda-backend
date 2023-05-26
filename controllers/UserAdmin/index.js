"use strict";

const response = require("../../components/response")
const userAdminModule = require("./user.module")
const { db } = require("../../components/database")
const bcrypt = require("bcrypt")
const { nanoid } = require('nanoid');
const jwt = require("jsonwebtoken")
const { validationEmail } = require("../../middlewares/validator")


exports.getUserById = async (req, res, next) => {
  console.log(req.query.id)
  if (!req.query.id) return response.res400(res, "id is required.")
  const resUser = await userAdminModule.getUserById(req.query.id)
  return response.res200(res, "000", "Success get user", resUser)
}

exports.registerUserAdmin = async (req, res, next) => {
  const { email, phone, first_name, last_name, fullname, password, confPassword, role } = req.body
  if (!first_name) return response.res400(res, "Nama depan wajib diisi.")
  if (!last_name) return response.res400(res, "Nama belakang wajib diisi.")
  if (!email) return response.res400(res, "Email wajib diisi.")
  if (!validationEmail(email)) return response.res400(res, "Email harus valid.")
  if (!phone) return response.res400(res, "Nomor telepon / whatsapp wajib diisi.")
  if (!password) return response.res400(res, "Password wajib diisi.")
  if (password.length < 6) return response.res400(res, "Password harus berisi 6 karakter atau lebih.")
  if (password !== confPassword) return response.res400(res, "Password dan Confirm Password tidak cocok.")

  const checkEmail = await userAdminModule.getUserByEmail(email);
  if (checkEmail) return response.res400(res, "Email sudah terdaftar")

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  const payload = {
    id: nanoid(25),
    email,
    first_name,
    last_name,
    phone,
    fullname, 
    password: hashPassword,
    role: 0
  }
  console.log(payload)
  try {
    await userAdminModule.registerPassword(payload)
    return response.res200(res, "000", "Register Berhasil.")
  } catch (error) {
    console.error(error)
    return response.res200(res, "001", "Register Gagal. Mohon cek kembali data user yang dibuat.")
  }
}

exports.loginAdmin = async (req, res, next) => {
  const payload = {
    email: req.body.email,
    password: req.body.password
  }

  if (!payload.email) return response.res400(res, "Email harus diisi.")
  if (!payload.password) return response.res400(res, "Password harus diisi.")
  
  const user = await userAdminModule.getUserByEmail(payload.email);
  if (!user) return response.res400(res, "Email tidak ditemukan.");
  if (user.role !== 0) return response.res401(res);

  const match = await bcrypt.compare(payload.password, user.password)
  if (!match) return response.res400(res, "Password salah.")

  const userId = user.id
  const name = user.fullname
  const email = user.email
  const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET_ADMIN, {
    expiresIn: '20s'
  })

  const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET_ADMIN, {
    expiresIn: '1d'
  })
  console.log({ refreshToken })
  try {
    await userAdminModule.updateRefreshToken(userId, refreshToken)
  } catch (error) {
    console.error(error)
    return response.res400(res, "failed update token")
  }

  res.cookie('refreshTokenAdmin', refreshToken, {
    // httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    // secure: true,
    // domain: "localhost",
    // path: "/",
    // sameSite: "None"
  })
  return response.res200(res, "000", "Login Berhasil.", accessToken)
}

exports.refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshTokenAdmin;
    console.log(refreshToken)
    console.log("WKKW")
    if (!refreshToken) return response.res401(res)
    console.log("WKKW2")
    const user = await userAdminModule.getRefreshToken(refreshToken);
    console.log(user)
    if (!user[0]) return response.res401(res);
    // if (!user[0].role !== 0) return response.res401(res);
    console.log("WKWKBLEEE")
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_ADMIN, (error, decoded) => {
      if (error) return response.res401(res)
      const { id: userId, email, fullname: name } = user[0]
      const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET_ADMIN, {
        expiresIn: '15s'
      })

      return response.res200(res, "000", "Success generate token.", accessToken);
    })
  } catch (error) {
    console.error(error)
  }
}

exports.logoutAdmin = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshTokenAdmin;
    console.log(refreshToken, req.cookies)
    if (!refreshToken) return response.res200(res, "001", "No content")

    const user = await userAdminModule.getRefreshToken(refreshToken);
    if (!user[0]) return response.res200(res, "001", "No content")

    const userId = user[0].id

    await userAdminModule.updateRefreshToken(userId, null)
    
    res.clearCookie('refreshTokenAdmin')
    return response.res200(res, "000", "Berhasil Logout.")
  } catch (error) {
    console.error(error)
  }
}

exports.getLatestUser = async (req, res, next) => {
  const resUser = await userAdminModule.getLatestUser()
  if (resUser.length < 1) return response.res400(res, "User belum ada.")
  return response.res200(res, "000", "Sukses mengambil data user yang baru terdaftar di Monta Kitchen", resUser)
}