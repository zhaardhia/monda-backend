const apicache = require("apicache");
const cache = apicache.middleware;
const response = require("../../components/response");
const { body, param, query, validationResult } = require("express-validator");
const validator = require("../../middlewares/validator");
const verifyToken = require("../../middlewares/verifyToken")
const express = require("express");
const router = express.Router();

const belanjaBulananController = require("../../controllers/BelanjaBulanan");

const index = function (req, res, next) {
  response.res404(res);
};

router.route("/")
  .get((req, res, next) => {
    belanjaBulananController.getUserListBelanjaBulanan(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })
  .post((req, res, next) => {
    belanjaBulananController.addProductToBelanjaBulanan(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })
  .put((req, res, next) => {
    belanjaBulananController.editScheduler(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })
  .delete((req, res, next) => {
    belanjaBulananController.removeProductFromBelanjaBulanan(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })  

router.route("/get-item")
  .get((req, res, next) => {
    belanjaBulananController.getItemBelanjaBulanan(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })

router.all("*", index);

module.exports = router;
