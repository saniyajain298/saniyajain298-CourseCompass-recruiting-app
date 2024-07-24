var express = require("express");
var router = express.Router();
const productController = require("../controllers/productController.js");
const middleware = require("../middlewares/middlewares.js");

router.post("/validate-email", productController.validateEmail);
router.post("/verify-otp", productController.verifyOtp);
router.get("/company-profile/:email", productController.getCompany);
router.post("/credits-reduce", productController.creditReduce);
router.post("/signup", productController.signup);

router.post("/login", productController.login);

// router.get(
//   "/getuser/:userId",
//   middleware.allowIfLoggedin,
//   productController.getUser
// );


module.exports = router;
