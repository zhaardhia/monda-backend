const apicache = require("apicache");
const cache = apicache.middleware;
const response = require("../../components/response");
const { body, param, query, validationResult } = require("express-validator");
const validator = require("../../middlewares/validator");
const verifyToken = require("../../middlewares/verifyToken")
const express = require("express");
const router = express.Router();

const paymentController = require("../../controllers/Payment");

const index = function (req, res, next) {
  response.res404(res);
};

router.route("/charge")
  .post((req, res, next) => {
    paymentController.chargePayment(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })
router.route("/notification")
  .post((req, res, next) => {
    paymentController.callbackNotificationPayment(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })
router.route("/check-status")
  .get((req, res, next) => {
    paymentController.checkStatusPayment(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })
router.route("/cancel-payment")
  .get((req, res, next) => {
    paymentController.cancelPayment(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })
router.route("/get-payment-order")
  .get((req, res, next) => {
    paymentController.getPaymentOrderById(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })

router.all("*", index);

module.exports = router;
