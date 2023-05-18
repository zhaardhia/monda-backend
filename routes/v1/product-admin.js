const apicache = require("apicache");
const cache = apicache.middleware;
const response = require("../../components/response");
const { body, param, query, validationResult } = require("express-validator");
const validator = require("../../middlewares/validator");
const { verifyTokenAdmin } = require("../../middlewares/verifyToken")
const express = require("express");
const router = express.Router();

const productAdminController = require("../../controllers/ProductAdmin");

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

router.route("/best-sellers")
  // .get(verifyTokenAdmin, (req, res, next) => {
  .get((req, res, next) => {
    productAdminController.getThreeBestSellerProduct(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })

router.route("/get-all-products")
  // .get(verifyTokenAdmin, (req, res, next) => {
  .get((req, res, next) => {
    productAdminController.getAllProducts(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })
//   .put(verifyToken.verifyToken, (req, res, next) => {
//     userController.updateUserProfile(req, res).catch((error) => {
//       console.error(error);
//       return response.res500(res, "Internal system error, please try again later!");
//     });
//   })

// router.route("/register-admin")
//   .post((req, res, next) => {
//     userAdminController.registerUserAdmin(req, res).catch((error) => {
//       console.error(error);
//       return response.res500(res, "Internal system error, please try again later!");
//     });
//   })

router.all("*", index);

module.exports = router;
