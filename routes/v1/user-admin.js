const apicache = require("apicache");
const cache = apicache.middleware;
const response = require("../../components/response");
const { body, param, query, validationResult } = require("express-validator");
const validator = require("../../middlewares/validator");
const { verifyTokenAdmin } = require("../../middlewares/verifyToken")
const express = require("express");
const router = express.Router();

const userAdminController = require("../../controllers/UserAdmin");

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

// router.route("/user-info")
//   .get(verifyToken.verifyToken, (req, res, next) => {
//     userController.getUserById(req, res).catch((error) => {
//       console.error(error);
//       return response.res500(res, "Internal system error, please try again later!");
//     });
//   })
//   .put(verifyToken.verifyToken, (req, res, next) => {
//     userController.updateUserProfile(req, res).catch((error) => {
//       console.error(error);
//       return response.res500(res, "Internal system error, please try again later!");
//     });
//   })

router.route("/register-admin")
  .post((req, res, next) => {
    userAdminController.registerUserAdmin(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })

router.route("/login-admin")
  .post((req, res, next) => {
    userAdminController.loginAdmin(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })

router.route("/token-admin")
  .get((req, res, next) => {
    userAdminController.refreshToken(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })

router.route("/logout-admin")
  .delete((req, res, next) => {
    userAdminController.logoutAdmin(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })



router.route("/latest-user")
  .get((req, res, next) => {
    userAdminController.getLatestUser(req, res).catch((error) => {
      console.error(error);
      return response.res500(res, "Internal system error, please try again later!");
    });
  })
router.all("*", index);

module.exports = router;
