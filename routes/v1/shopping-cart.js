const apicache = require("apicache");
const cache = apicache.middleware;
const response = require("../../components/response");
const { body, param, query, validationResult } = require("express-validator");
const validator = require("../../middlewares/validator");
const verifyToken = require("../../middlewares/verifyToken")
const express = require("express");
const router = express.Router();

const shoppingCartController = require("../../controllers/ShoppingCart");

const index = function (req, res, next) {
  response.res404(res);
};

router.route("/")
  //.post(verifyToken.verifyToken, (req, res, next) => { // use this to activate middleware for session user login
  .post((req, res, next) => {
    shoppingCartController.cartItem(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })
  .put((req, res, next) => {
    shoppingCartController.minShoppingCart(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })

router.route("/insert-product")



router.all("*", index);

module.exports = router;
