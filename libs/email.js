const nodemailer = require("nodemailer")
const { orderCreatedTemplateEmail, orderPaidTemplateEmail, orderPaidVerifTemplateEmail, orderShipmentTemplateEmail, orderDoneTemplateEmail, subjectEmail } = require("./utils")
exports.orderCreated = async (email, order_id, status) => {

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    service: 'gmail',
    secure: false,
    auth: {
      user : process.env.NODEMAILER_EMAIL,
      pass : process.env.NODEMAILER_PASS
    }
  })

  const options = {
    from: "'Monda Kitchen' <tokomondakitchen@gmail.com>",
    to: email,
    subject: subjectEmail(status),
    html: status === "order_created" ? orderCreatedTemplateEmail(order_id)
      : status === "order_paid" ? orderPaidTemplateEmail(order_id)
      : status === "order_paid_verified" ? orderPaidVerifTemplateEmail(order_id)
      : status === "order_shipment" ? orderShipmentTemplateEmail(order_id)
      : status === "order_done" ? orderDoneTemplateEmail()
      : ""
  };

  try {
    await transporter.sendMail(options, (err, info) => {
      console.log("TESS")
      console.log({err})
      if(err) console.error(err);
      console.log("MESSAGE ID: ", info.messageId);
      console.log(`Email Sent to: ${email}`)
    })
    return { succeed: true, message: "Sukses mengirim email kepada pelanggan" }
  } catch (error) {
    console.error(error)
    return { succeed: false, message: "Gagal mengirim email kepada pelanggan" }
  }
}

exports.reminderBelanjaBulanan = async (email, product) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    service: 'gmail',
    secure: false,
    auth: {
      user : process.env.NODEMAILER_EMAIL,
      pass : process.env.NODEMAILER_PASS
    }
  })

  let host
  if (process.env.THIS_SERVICE_HOST.includes("127.0.0.1")) host = 'http://localhost:3000'
  else host = 'https://mondakitchen.com'

  const options = {
    from: "'Monda Kitchen' <tokomondakitchen@gmail.com>",
    to: email,
    subject: "Waktu Belanja Bulanan Tiba!",
    html: `
      <p>Hai Monders! Sekarang waktunya belanja bulanan, loh! Jangan lupa checkout produk yang sudah anda tambahkan ke reminder belanja bulanan anda. Berikut produk yang sudah kami tambahkan ke keranjang:</p>
      <ul>
        ${product.map((data) => {
          return `<li>${data}</li>`
        })}
      </ul>
      <p>Bila anda sudah login website kami, anda dapat cek keranjang ada pada <a href=${`${host}/shop/shopping-cart`}>halaman berikut ini</a>. Terima kasih!</p>
      <br/>
      <p>Salam hangat,</p>
      <p>Team Monda Kitchen</p>
    `
  }

  try {
    await transporter.sendMail(options, (err, info) => {
      console.log("TESS")
      console.log({err})
      if(err) console.error(err);
      console.log("MESSAGE ID: ", info.messageId);
      console.log(`Email Sent to: ${email}`)
    })
    return { succeed: true, message: "Sukses mengirim email kepada pelanggan" }
  } catch (error) {
    console.error(error)
    return { succeed: false, message: "Gagal mengirim email kepada pelanggan" }
  }
}

exports.forgotPass = async (email, forgot_pass_token) => {

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    service: 'gmail',
    secure: false,
    auth: {
      user : process.env.NODEMAILER_EMAIL,
      pass : process.env.NODEMAILER_PASS
    }
  })

  let host
  if (process.env.THIS_SERVICE_HOST.includes("127.0.0.1")) host = 'http://localhost:3000/change-password'
  else host = 'https://mondakitchen.com/change-password'

  const options = {
    from: "'Monda Kitchen' <tokomondakitchen@gmail.com>",
    to: email,
    subject: "Ubah Password Akun Monda Kitchen",
    html: `
      <p>Sistem kami mendeteksi bahwa ada permintaan ganti password akun anda pada website Monda Kitchen. Jika benar anda ingin merubah password, silahkan akses sistem ganti password pada <a href=${`${host}/${forgot_pass_token}`}>halaman berikut ini</a>. Terima kasih!</p>
      <br/>
      <p>Salam hangat,</p>
      <p>Team Monda Kitchen</p>
    `
  };

  try {
    await transporter.sendMail(options, (err, info) => {
      console.log("TESS")
      console.log({err})
      if(err) console.error(err);
      console.log("MESSAGE ID: ", info.messageId);
      console.log(`Email Sent to: ${email}`)
    })
    return { succeed: true, message: "Sukses mengirim email kepada pelanggan" }
  } catch (error) {
    console.error(error)
    return { succeed: false, message: "Gagal mengirim email kepada pelanggan" }
  }
}
