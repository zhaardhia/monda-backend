"use strict";

const sequelize = require("sequelize");
const Sequelize = require("sequelize")
const { db } = require("../../components/database")
const { Op } = sequelize;
const { 
	tunai_users,
  log_migrationphoto_oss
} = require("../../components/database");

exports.getUidWithNoOss = async () => {
  // return tunai_users.findAll({
  //   raw: true,
  //   where: {
  //     [Op.or] : {
  //       uimg1: {
  //         [Op.notLike]: `%${process.env.OSS_BUCKET}%`,
  //       },
  //       uimg2: {
  //         [Op.notLike]: `%${process.env.OSS_BUCKET}%`,
  //       },
  //       uimg3: {
  //         [Op.notLike]: `%${process.env.OSS_BUCKET}%`,
  //       },
  //       uimg4: {
  //         [Op.notLike]: `%${process.env.OSS_BUCKET}%`,
  //       },
  //     }
  //   },
  //   attributes: ["uid", "ufullname", "uimg1", "uimg2", "uimg3", "uimg4"]
  // })

  const query = `select tu.uid, tu.ufullname , (case when uimg1 like '%${process.env.OSS_BUCKET}%' then '' else uimg1 end) as uimg1, (case when uimg2 like '%${process.env.OSS_BUCKET}%' then '' else uimg2 end) as uimg2 , (case when uimg3 like '%${process.env.OSS_BUCKET}%' then '' else uimg3 end) uimg3, (case when uimg4 like '%${process.env.OSS_BUCKET}%' then '' else uimg4 end) uimg4 from tunai_user tu`;

  const resultQuery = await db.query(query, {
    raw: true,
    type: Sequelize.QueryTypes.SELECT,
  })
  .then(result => {
      console.log(result)
      return result
  })
  return resultQuery
}


//uimg1 NOT LIKE 'http%' OR
// uimg2 NOT LIKE 'http%' OR
// uimg3 NOT LIKE 'http%' OR
// uimg4 NOT LIKE 'http%'

// exports.getAllUserImageInfo = async (uid) => {
//   return tunai_users.findOne({
//     raw: true,
//     where: {
//       uid
//     },
//     attributes: ["uid", "uimg1", "uimg2", "uimg3", "uimg4"]
//   })
// }

exports.updateUrlPhoto = async (dbTransaction, uid, updateParams) => {
  return tunai_users.update(
    {
      ...updateParams
    },
    {
      where: {
        uid
      },
      transaction: dbTransaction
    }
  )
}

exports.createLogMigration = async (dbTransaction, payload) => {
  const { 
    uid, 
    datetimetrx, 
    uimg_old,
    uimg_new
  } = payload
  return log_migrationphoto_oss.create({
    transaction: dbTransaction,
    uid, 
    datetimetrx, 
    uimg_old: {
      ...uimg_old
    },
    uimg_new: {
      ...uimg_new
    }
  })
}