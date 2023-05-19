const apicache = require("apicache");
const cache = apicache.middleware;
const response = require("../../components/response");
const { body, param, query, validationResult } = require("express-validator");
const validator = require("../../middlewares/validator");
const verifyToken = require("../../middlewares/verifyToken")
const express = require("express");
const router = express.Router();

const productController = require("../../controllers/Product");

const index = function (req, res, next) {
  response.res404(res);
};

router.route("/")
  .get((req, res, next) => {
    productController.getAllProducts(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })
  .post(verifyToken.verifyTokenAdmin, (req, res, next) => { // use this to activate middleware for session user login
  // .post((req, res, next) => {
    productController.insertProduct(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })
  .put(verifyToken.verifyTokenAdmin, (req, res, next) => {
  // .put((req, res, next) => {
    productController.updateProduct(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })

router.route("/detail-product")
  .get((req, res, next) => {
    productController.getProductById(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })

router.route("/insert-product")



router.all("*", index);

module.exports = router;
