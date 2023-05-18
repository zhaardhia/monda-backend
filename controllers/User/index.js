"use strict";

const response = require("../../components/response")
const userModule = require("./user.module")
const { db } = require("../../components/database")
const bcrypt = require("bcrypt")
const { nanoid } = require('nanoid');
const jwt = require("jsonwebtoken")
const { validationEmail } = require("../../middlewares/validator")

exports.getAllUidWithNoOss = async (req, res, next) => {
  const resAllUser = await userModule.getAllUserImageInfo()
  // if (resAllUser.length < 1) return response.res400(res, "")
  return response.res200(res, "000", "Success get all user", resAllUser)
}

exports.getUserById = async (req, res, next) => {
  console.log(req.query.id)
  if (!req.query.id) return response.res400(res, "id is required.")
  const resUser = await userModule.getUserById(req.query.id)
  return response.res200(res, "000", "Success get user", resUser)
}

exports.updateUserProfile = async (req, res, next) => {
  const payload = {
    email: req.body.email,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    fullname: `${req.body.first_name} ${req.body.last_name}`,
    address: req.body.address,
    phone: req.body.phone,
    city: req.body.city,
    postal_code: req.body.postal_code
  }
  console.log(req.headers)
  console.log(req.body)

  if (!req.body.id) return response.res400(res, "ID tidak boleh kosong.")
  if (!payload.email) return response.res400(res, "Email tidak boleh kosong.")
  if (!validationEmail(payload.email)) return response.res400(res, "Email harus valid.")
  if (!payload.first_name) return response.res400(res, "Nama depan tidak boleh kosong.")
  if (!payload.phone) return response.res400(res, "Nomor telepon / whatsapp tidak boleh kosong.")
  if (payload.address && (!payload.city || !payload.postal_code)) response.res400(res, "Kota & kode pos wajib diisi jika alamat sudah diisi.")
  const dbTransaction = await db.transaction()
  try {
    await userModule.updateUserProfile(dbTransaction, payload, req.body.id)
    dbTransaction.commit()
    return response.res200(res, "000", "Sukses mengubah data user.")
  } catch (error) {
    dbTransaction.rollback()
    console.error(error)
    return response.res200(res, "001", "Terjadi kesalahan ketika update data user.")
  }
}

exports.registerUser = async (req, res, next) => {
  const { email, phone, first_name, last_name, fullname, password, confPassword, role } = req.body
  if (!first_name) return response.res400(res, "Nama depan wajib diisi.")
  if (!last_name) return response.res400(res, "Nama belakang wajib diisi.")
  if (!email) return response.res400(res, "Email wajib diisi.")
  if (!validationEmail(email)) return response.res400(res, "Email harus valid.")
  if (!phone) return response.res400(res, "Nomor telepon / whatsapp wajib diisi.")
  if (!password) return response.res400(res, "Password wajib diisi.")
  if (password.length < 6) return response.res400(res, "Password harus berisi 6 karakter atau lebih.")
  if (password !== confPassword) return response.res400(res, "Password dan Confirm Password tidak cocok.")

  const checkEmail = await userModule.getUserByEmail(email);
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
  console.log({ refreshToken })
  try {
    await userModule.updateRefreshToken(userId, refreshToken)
  } catch (error) {
    console.error(error)
    return response.res400(res, "failed update token")
  }

  res.cookie('refreshToken', refreshToken, {
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
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken)
    console.log("WKKW")
    if (!refreshToken) return response.res401(res)
    console.log("WKKW2")
    const user = await userModule.getRefreshToken(refreshToken);
    console.log(user)
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
    console.log(refreshToken, req.cookies)
    if (!refreshToken) return response.res200(res, "001", "No content")

    const user = await userModule.getRefreshToken(refreshToken);
    if (!user[0]) return response.res200(res, "001", "No content")

    const userId = user[0].id

    await userModule.updateRefreshToken(userId, null)
    
    res.clearCookie('refreshToken')
    return response.res200(res, "000", "Berhasil Logout.")
  } catch (error) {
    console.error(error)
  }
}