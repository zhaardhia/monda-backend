"use strict";

const sequelize = require("sequelize");
const { Op } = sequelize;
const { 
	tunai_users,
  log_migrationphoto_oss
} = require("../../components/database");

exports.getUidWithNoOss = async () => {
  return tunai_users.findAll({
    raw: true,
    where: {
      [Op.or] : {
        uimg1: {
          [Op.notLike]: `%${process.env.OSS_BUCKET}%`,
        },
        uimg2: {
          [Op.notLike]: `%${process.env.OSS_BUCKET}%`,
        },
        uimg3: {
          [Op.notLike]: `%${process.env.OSS_BUCKET}%`,
        },
        uimg4: {
          [Op.notLike]: `%${process.env.OSS_BUCKET}%`,
        },
      }
    },
    attributes: ["uid", "ufullname", "uimg1", "uimg2", "uimg3", "uimg4"]
  })
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