const apicache = require("apicache");
const cache = apicache.middleware;
const response = require("../../components/response");
const { body, param, query, validationResult } = require("express-validator");
const validator = require("../../middlewares/validator");
const express = require("express");
const router = express.Router();

const migrasiOssController = require("../../controllers/MigrasiOss");

const index = function (req, res, next) {
  response.res404(res);
};

router.route("/")
  .put((req, res, next) => {
    migrasiOssController.migratePhotoOss(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })

router.route("/uid-no-oss")
  .get((req, res, next) => {
    migrasiOssController.getAllUidWithNoOss(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })
// router.route("/test")
//   .get((req, res, next) => {
//     migrasiOssController.testing(req, res).catch((error) => {
//       console.error(error);
//       return response.res500(res, "Internal system error, please try again later!");
//     });
//   })

router.all("*", index);

module.exports = router;
