const express = require("express");
const router = express.Router();
const userController = require("../controller/user");

router.post("/signup", userController.createUser);
router.post("/login", userController.postLogin);
router.get("/get-user/:id/:mode", userController.getUserById);

router.post("/companylogin", userController.postCompanyLogin);
router.post("/companysignup", userController.postCompanyUser);

module.exports = router;
