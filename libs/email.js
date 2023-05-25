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
