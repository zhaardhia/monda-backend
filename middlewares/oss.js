"use strict";

const axios = require("axios");
const crypto = require("crypto");

exports.uploadFileOSS = async (stringFile) => {
  // return {
  //     message: 'Operation success',
  //     values: {
  //       filename: 'fjLowmjkOZIO3D9.png',
  //       fileurl: 'http://ikimoda-dev.oss-ap-southeast-5.aliyuncs.com/fjLowmjkOZIO3D9.png'
  //     }
  // }

  // Headers
  let timestamp = +new Date();
  let token = `${timestamp}${process.env.OSS_APP_KEY}`
  let hashToken = crypto.createHmac('sha256', process.env.OSS_SECRET_KEY).update(token).digest('hex')
  // Set default if env = dev
  if(process.env.NODE_ENV != "PRODUCTION"){
      timestamp = "abc";
      hashToken = "cd620c8402d3e2d3d399b79cf06bcc77bf63c3113c7e171f5cede9a41f96749a"
  }

  const headersUploadFile = {
      token: hashToken,
      timestamp: timestamp,
      app_identifier: process.env.OSS_APP_IDENTIFIER
  }

  console.log(headersUploadFile)
  // Body
  const paramsUploadFile = {
      bucket: process.env.OSS_BUCKET,
      filedata: stringFile,
  }

  // Config
  const configUploadFile = {
      url: process.env.OSS_URL,
      method: "POST",
      headers: headersUploadFile,
      data: paramsUploadFile
  }
  // Request
  return axios(configUploadFile).then((result) => (result?.data) ? result.data : null).catch((error)=>{
      if (error?.response?.data) {
          console.error(error?.response?.data);
          throw error;
      } else if (error?.request) {
          console.error(error.message);
          throw error;
      } else {
          console.error(error.config);
          throw error;
      }
  })

  // {
  //     message: 'Operation success',
  //     values: {
  //       filename: 'fjLowmjkOZIO3D9.png',
  //       fileurl: 'http://ikimoda-dev.oss-ap-southeast-5.aliyuncs.com/fjLowmjkOZIO3D9.png'
  //     }
  // }
}
