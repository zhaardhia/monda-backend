const apicache = require("apicache");
const cache = apicache.middleware;
const response = require("../../components/response");
const { body, param, query, validationResult } = require("express-validator");
const validator = require("../../middlewares/validator");
const verifyToken = require("../../middlewares/verifyToken")
const express = require("express");
const router = express.Router();

const orderController = require("../../controllers/Order");

const index = function (req, res, next) {
  response.res404(res);
};

router.route("/checkout")
  .post((req, res, next) => {
    orderController.orderProduct(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })

router.route("/verified-payment")
  .post((req, res, next) => {
    orderController.verifiedPayment(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })

router.route("/process-to-shipment")
  .post((req, res, next) => {
    orderController.processToShipment(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })
router.route("/done-order")
  .post((req, res, next) => {
    orderController.doneOrder(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })

router.route("/list-order")
  .get((req, res, next) => {
    orderController.userListOrder(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })
router.route("/order-detail")
  .get((req, res, next) => {
    orderController.userOrderDetail(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })

router.all("*", index);

module.exports = router;
