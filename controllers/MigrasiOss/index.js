"use strict";

const response = require("../../components/response")
const migrasiOssModule = require("./migrasiOss.module")
const { db } = require("../../components/database")
const axios = require("axios")
const AxiosClient = axios.create({
  timeout: 60000
});
const { writeFile, unlink, readFile, access } = require("fs/promises");
const { constants } = require("fs")
const fs = require('fs'); 
const { detectMimeType }  = require("../../middlewares/detectMimeType")
const { uploadFileOSS } = require("../../middlewares/oss")

exports.getAllUidWithNoOss = async (req, res, next) => {
  const resUidNoOss = await migrasiOssModule.getUidWithNoOss();
  
  if (resUidNoOss.length < 1) return response.res400(res, "Foto user di local server sudah tidak ditemukan.")

  return response.res200(res, "000", "Sukses mengembalikan data borrower", resUidNoOss)
}

exports.migratePhotoOss = async (req, res, next) => {
  const payload = {
    data: req.body.data
  }

  if (payload.data === undefined) return response.res400(res, "data is not defined.")
  if (payload.data.length < 1) return response.res400(res, "there is no uid that has been checked.")

  let objResponse = []

  for (const e of payload.data) {
    let objPhoto = e?.photos
    let uimg = {}

    const propsLog = {
      uid: e.uid,
      datetimetrx: new Date(),
      uimg_old: {},
      uimg_new: {}
    }

    if (e.uid === undefined || e.uid === null) return response.res400(res, "uid is not found.")
    if (e.photos === undefined || e.photos === null) return response.res400(res, "photos is not found.")

    let objDataResponse = {
      uid: e.uid,
      success: 0,
      failed: 0
    }

    for (const v in objPhoto) {
      console.log(objPhoto[v]);
      let imageBase64;
      if (objPhoto[v].includes("http")) {
        imageBase64 = await AxiosClient.get(objPhoto[v],{
          responseType: "arraybuffer"
        })
        .then(response => Buffer.from(response.data, 'binary').toString('base64'))
        .catch(error => {
          console.error(error)
        })
      }else {
        console.log(objPhoto[v]);

        let flagCheckPhoto = 0;
        try {
          await access(`${process.env.URL_IKIMODAL}/borrower/${objPhoto[v]}`, constants.F_OK);
          console.log('can access');
          flagCheckPhoto = 1;
        } catch (error) {
          console.error(`cannot access ${process.env.URL_IKIMODAL}/borrower/${objPhoto[v]}`);
          flagCheckPhoto = 0;
        }

        if (flagCheckPhoto === 1) {
          imageBase64 = await AxiosClient.get(`${process.env.URL_IKIMODAL}/borrower/${objPhoto[v]}`,{
            responseType: "arraybuffer"
          })
          .then(response => Buffer.from(response.data, 'binary').toString('base64'))
          .catch(error => {
            console.error(error)
          })
        }
      }
      // console.log(imageBase64)
      
      if (imageBase64 !== undefined) {
        const mimeType = detectMimeType(imageBase64)
    
        const dataUrl = `data:${mimeType};base64,${imageBase64}`
        let urlOss;
      
        await uploadFileOSS(dataUrl).then((resultOss) => {
          urlOss = resultOss?.values.fileurl
          // console.log(urlOss)
        }).catch(() => null )

        propsLog.uimg_old[v] = objPhoto[v]
        propsLog.uimg_new[v] = urlOss

        uimg[v] = urlOss
        objDataResponse.success += 1
      }else {
        propsLog.uimg_old[v] = objPhoto[v]
        propsLog.uimg_new[v] = "Migration failed. Check if the url is valid."

        uimg[v] = objPhoto[v]
        objDataResponse.failed += 1;
      }
      
    }

    const dbTransaction = await db.transaction();
    try {
      await migrasiOssModule.updateUrlPhoto(dbTransaction, e.uid, uimg)
      await migrasiOssModule.createLogMigration(dbTransaction, propsLog)
      await dbTransaction.commit();
    } catch (error) {
      await dbTransaction.rollback();
      throw error;
    }
    objResponse.push(objDataResponse)
  }

  return response.res200(res, '000', 'Process Migrate Photos Succeed', objResponse)
}