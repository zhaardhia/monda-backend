const express = require("express");
const response = require("../../components/response");
const router = express.Router();

const index = function (req, res, next) {
  response.res404(res);
};

router.all("/", index);
router.all("/connect", (req, res, next) => {
  response.res200(res, '000', 'Connection Established')
});

// router.all('/', index);
router.use("/user", require("./user"));
router.use("/user-admin", require("./user-admin"));
router.use("/product-admin", require("./product-admin"));
router.use("/order-admin", require("./order-admin"));
router.use("/product", require("./product"));
router.use("/shopping-cart", require("./shopping-cart"));
router.use("/order", require("./order"));
router.use("/payment", require("./payment"));
router.use("/courier", require("./courier"));
router.use("/email", require("./email"));

router.all('*', index);

module.exports = router;
