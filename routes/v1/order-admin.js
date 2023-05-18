const apicache = require("apicache");
const cache = apicache.middleware;
const response = require("../../components/response");
const { body, param, query, validationResult } = require("express-validator");
const validator = require("../../middlewares/validator");
const { verifyTokenAdmin } = require("../../middlewares/verifyToken")
const express = require("express");
const router = express.Router();

const orderAdminController = require("../../controllers/OrderAdmin");

const index = function (req, res, next) {
  response.res404(res);
};

// router.route("/")
//   .get(verifyToken.verifyToken, (req, res, next) => {
//     userController.getAllUidWithNoOss(req, res).catch((error) => {
//       console.error(error);
//       return response.res500(res, "Internal system error, please try again later!");
//     });
//   })

router.route("/latest-transaction")
  // .get(verifyTokenAdmin, (req, res, next) => {
  .get((req, res, next) => {
    orderAdminController.getLatestTransaction(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })
router.route("/this-month-income")
  // .get(verifyTokenAdmin, (req, res, next) => {
  .get((req, res, next) => {
    orderAdminController.getThisMonthsIncome(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })

router.all("*", index);

module.exports = router;
