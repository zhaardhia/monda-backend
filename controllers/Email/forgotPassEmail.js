const nodemailer = require("nodemailer")
const response = require("../../components/response")
exports.forgotPassEmail = (req, res, next) => {
  // const payload = { 
  //   email: req.query.email, 
  //   nik: req.query.nik, 
  //   nama: req.query.nama, 
  //   no_antrian : req.query.no_antrian
  // } 
  // const { email, nik, nama, no_antrian } = payload
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    service: 'gmail',
    auth: {
      user : process.env.NODEMAILER_EMAIL,
      pass : process.env.NODEMAILER_PASS
    }
  })

  const sendMail = () => {
    // const { email, nik, nama, no_antrian } = payload
    const options = {
      from: "'Monda Kitchen' <no-reply@gmail.com>",
      to: "firzharamadhan27@gmail.com",
      subject: 'Akses Ganti / Lupa Password',
      html: 
        `
          <p>Selamat anda telah berhasil mendaftar dan mendapatkan nomor antrian online Kantor Pertanahan Kota Tangerang Selatan</p>
          <p>Dengan identitas:<p/>
          <ul>
            <li>NIK = wkwk</li>
            <li>Nama = wkwk</li>
            <li>No Antrian = wkwk</li>
          </ul>
          <p>Jam Pelayanan Pendaftaran: <strong>08.00 - 12.00 WIB</strong></p>
          <p>Jam Pelayanan Pengambilan Produk: <strong>13.00 - 15.00 WIB</strong></p>
          <br/>
          <p>Tunjukan bukti pendaftaran antrian online ini kepada petugas Kantor Pertanahan Kota Tangerang Selatan</p>
          <p>Terima kasih.</p>

        `
    };

    transporter.sendMail(options, (err, info) => {
      console.log("TESS")
      console.log({err})
      if(err) console.error(err);
      console.log(`Email Sent to: firzharamadhan27@gmail.com`)
      return response.res200(res, "000", "Sukses")
    })
  }
  
  sendMail()
}
