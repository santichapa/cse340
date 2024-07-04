// Needed resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");

// Route to build account login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to get the regitration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to post the registration
router.post("/register", utilities.handleErrors(accountController.registerAccount));

module.exports = router;