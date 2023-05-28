"use strict";
const response = require("../components/response");
const { cart_item, shopping_session, user, product, scheduler_belanja, scheduler_belanja_item, db } = require("../components/database");
const axios = require("axios");
const moment = require("moment");
const schedule = require("node-schedule");
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const { nanoid } = require("nanoid")
const { reminderBelanjaBulanan } = require("../libs/email")
const cronBelanjaBulanan = async (req, res, next) => {
  console.log(`========== [ CRON BELANJA BULANAN STARTED AT ${new Date().toLocaleString('sv')}] ==========`);

  const resScheduler = await scheduler_belanja.findAll({
    raw: true,
    where: {
      hour: +(moment().tz('Asia/Jakarta').hour()),
      date: +(moment().tz('Asia/Jakarta').date()),
      status: 1
    },
  })
  console.log("WKOAKOAWO", resScheduler)
  console.log("jam skrg:", +(moment().tz('Asia/Jakarta').hour()))
  console.log("tanggal skrg:", +(moment().tz('Asia/Jakarta').date()))
  console.log("spesifik date skrg:", (moment().tz('Asia/Jakarta').format("LLL")))

  if (resScheduler.length > 0) {
    for (const scheduler of resScheduler) {
      const productAssociate = scheduler_belanja_item.hasOne(product, {foreignKey: "id", sourceKey: "product_id"})
      const resBelanjaItem = await scheduler_belanja_item.findAll({
        raw: true,
        include: [
          {
            association: productAssociate,
            attributes: ["id", "name", "price", "stock"],
            required: false,
          },
        ],
        where: {
          scheduler_belanja_id: scheduler.id
        }
      })
      console.log({ resBelanjaItem })
      const resShoppingSession = await shopping_session.findOne({
        raw: true,
        where: {
          user_id: scheduler.user_id
        }
      })

      const resUser = await user.findOne({
        raw: true,
        where: {
          id: scheduler.user_id
        },
        attributes: ["id", "fullname", "email"]
      })

      if (resShoppingSession) {
        let productEmail = []
        for (const item of resBelanjaItem) {
          if (item["product.stock"] > 0) {
            const resCartItem = await cart_item.findOne({
              raw: true,
              where: {
                session_id: resShoppingSession.id,
                product_id: item["product.id"]
              }
            })

            try {
              if (resCartItem) {
                await cart_item.update(
                  {
                    quantity: +resCartItem.quantity + 1
                  },
                  {
                    where: {
                      id: resCartItem.id
                    }
                  }
                )
              } else {
                await cart_item.create({
                  id: nanoid(20),
                  session_id: resShoppingSession.id,
                  product_id: item.product_id,
                  quantity: 1,
                  created_date: new Date(),
                  updated_date: new Date()
                })
              }

              await shopping_session.update(
                {
                  total_amount: +resShoppingSession.total_amount + +item["product.price"]
                },
                {
                  where: {
                    id: resShoppingSession.id
                  }
                }
              )
              productEmail.push(item["product.name"])
              console.log(`success insert shopping cart in user id: ${scheduler.user_id}`)
            } catch (error) {
              console.error(error.message)
              console.error("terjadi kesalahan ketika input produk ke shopping cart")
            }
          }
        }
        if (productEmail.length > 0) reminderBelanjaBulanan(resUser.email, productEmail)
      } else {
        const sessionId = nanoid(20)
        const dbTransaction = await db.transaction()

        try {
          let total_amount = 0
          let flagInsertitem = false
          let productEmail = []
          for (const item of resBelanjaItem) {
            if (item["product.stock"] > 0) {
              await cart_item.create({
                transaction: dbTransaction,
                id: nanoid(20),
                session_id: sessionId,
                product_id: item.product_id,
                quantity: 1,
                created_date: new Date(),
                updated_date: new Date()
              })
  
              total_amount += +item["product.price"]
              flagInsertitem = true
              productEmail.push(item["product.name"])
            }
          }
          console.log({flagInsertitem, total_amount, productEmail})
          if (productEmail.length > 0) reminderBelanjaBulanan(resUser.email, productEmail)
          const payloadShoppingSession = {
            transaction: dbTransaction,
            id: sessionId,
            user_id: scheduler.user_id,
            total_amount: total_amount
          }

          if (flagInsertitem === true) {
            await shopping_session.create(payloadShoppingSession)
          }
          await dbTransaction.commit()
          console.log(`success insert shopping cart in user id: ${scheduler.user_id}`)
        } catch (error) {
          console.error(error)
          await dbTransaction.rollback()
          console.error(`Terjadi kesalahan ketika input data shopping cart in user id: ${scheduler.user_id}`)
        }
      }
    }
  }
  console.log(`========== [ CRON BELANJA BULANAN ENDED ] ==========`);
  return;
}

// let ruleCron = process.env.TIMER_CRON_BALANCE_DANA_TITIPAN.split(":") || ["00", "30"];
schedule.scheduleJob(`0 * * * *`, () => {
  cronBelanjaBulanan(); 
});

module.exports = cronBelanjaBulanan;