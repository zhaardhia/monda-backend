const path = require("path")
const fs = require('fs')

exports.removeImages = (filePath) => {
  filePath = path.join(__dirname, '../..', filePath)
  fs.unlink(filePath, err => console.log(err));
}

exports.orderCreatedTemplateEmail = (order_id) => {
  let host
  if (process.env.THIS_SERVICE_HOST.includes("127.0.0.1")) host = 'http://localhost:3000/shop/my-order'
  else host = 'https://mondakitchen.com/shop/my-order'
  return `
    <p>Selamat, pesanan kamu telah masuk kedalam sistem Monda Kitchen</p>
    <p>Berikut informasi pesanan anda bisa diakses di <a href=${`${host}/detail/${order_id}`}>halaman berikut ini</a>, dan informasi pembayaran bisa anda akses pada <a href=${`${host}/payment/${order_id}`}>halaman berikut ini</a></p>
    <p>Terima kasih.</p>
    <br/>
    <p>Salam hangat,</p>
    <p>Team Monda Kitchen</p>
  `
}

exports.orderPaidTemplateEmail = (order_id) => {
  let host
  if (process.env.THIS_SERVICE_HOST.includes("127.0.0.1")) host = 'http://localhost:3000/shop/my-order'
  else host = 'https://mondakitchen.com/shop/my-order'
  return `
    <p>Pesanan kamu telah dibayar. Mohon menunggu admin untuk memverifikasi pembayaranmu terlebih dahulu.</p>
    <p>Berikut informasi pesanan anda bisa diakses di <a href=${`${host}/detail/${order_id}`}>halaman berikut ini</a></p>
    <p>Terima kasih.</p>
    <br/>
    <p>Salam hangat,</p>
    <p>Team Monda Kitchen</p>
  `
}

exports.orderPaidVerifTemplateEmail = (order_id) => {
  let host
  if (process.env.THIS_SERVICE_HOST.includes("127.0.0.1")) host = 'http://localhost:3000/shop/my-order'
  else host = 'https://mondakitchen.com/shop/my-order'
  return `
    <p>Pembayaranmu telah diverifikasi admin. Mohon menunggu pihak Monda untuk mengirim orderanmu sesuai alamat yang dituju.</p>
    <p>Berikut informasi pesanan anda bisa diakses di <a href=${`${host}/detail/${order_id}`}>halaman berikut ini</a></p>
    <p>Terima kasih.</p>
    <br/>
    <p>Salam hangat,</p>
    <p>Team Monda Kitchen</p>
  `
}

exports.orderShipmentTemplateEmail = (order_id) => {
  let host
  if (process.env.THIS_SERVICE_HOST.includes("127.0.0.1")) host = 'http://localhost:3000/shop/my-order'
  else host = 'https://mondakitchen.com/shop/my-order'
  return `
    <p>Pesanan kamu sedang dalam perjalanan. Mohon menunggu hingga pesananmu sampai tujuan.</p>
    <p>Berikut informasi pesanan anda bisa diakses di <a href=${`${host}/detail/${order_id}`}>halaman berikut ini</a>, dan juga kamu dapat melacak pesanan kamu pada <a href="https://cekresi.com/">halaman berikut ini</a></p>
    <p>Terima kasih.</p>
    <br/>
    <p>Salam hangat,</p>
    <p>Team Monda Kitchen</p>
  `
}

exports.orderDoneTemplateEmail = () => {
  let host
  if (process.env.THIS_SERVICE_HOST.includes("127.0.0.1")) host = 'http://localhost:3000/shop/my-order'
  else host = 'https://mondakitchen.com/shop/my-order'
  return `
    <p>Pesanan kamu telah selesai diproses. Selamat menikmati produk dari Monda! Silahkan cek katalog produk kami di <a href=${`${host}/shop`}>halaman berikut ini</a> untuk lanjut berbelanja.</p>
    <p>Terima kasih telah berbelanja di website kami!</p>
    <br/>
    <p>Salam hangat,</p>
    <p>Team Monda Kitchen</p>
  `
}

exports.subjectEmail = (status) => {
  if (status === "order_created") return "Segera Bayar Pesanan Anda!"
  else if (status === "order_paid") return "Pembayaran Berhasil"
  else if (status === "order_paid_verified") return "Pembayaran Berhasil"
  else if (status === "order_shipment") return "Pesananmu Sedang Dalam Perjalanan"
  else if (status === "order_done") return "Yey! Pesananmu Telah Sampai & Selesai Diproses"
}