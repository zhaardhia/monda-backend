const apicache = require("apicache");
const cache = apicache.middleware;
const response = require("../../components/response");
const { body, param, query, validationResult } = require("express-validator");
const validator = require("../../middlewares/validator");
const verifyToken = require("../../middlewares/verifyToken")
const express = require("express");
const router = express.Router();

const userController = require("../../controllers/User");

const index = function (req, res, next) {
  response.res404(res);
};

router.route("/")
  .get(verifyToken.verifyToken, (req, res, next) => {
    userController.getAllUidWithNoOss(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })

router.route("/register-user")
  .post((req, res, next) => {
    userController.registerUser(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })

router.route("/login-user")
  .post((req, res, next) => {
    userController.login(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })

router.route("/token")
  .get((req, res, next) => {
    userController.refreshToken(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })

router.route("/logout-user")
  .delete((req, res, next) => {
    userController.logout(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })

router.all("*", index);

module.exports = router;
