// Needed resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");
const regValidate = require("../utilities/account-validation");
const validate = require("../utilities/inventory-validation");

// Route to account management view
router.get("/", 
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildAccountManagement))

// Route to build account login view
router.get("/login", 
    utilities.checkNotLoggedin,
    utilities.handleErrors(accountController.buildLogin));

// Route to post the login
router.post("/login", 
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin))

// Route to get the regitration view
router.get("/register", 
    utilities.checkNotLoggedin,
    utilities.handleErrors(accountController.buildRegister));

// Route to post the registration
router.post("/register", 
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

// Route to build the update account view
router.get("/edit-account/", 
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildEditAccount));

// Route to post the account updates
router.post("/edit-account/",
    utilities.checkLogin, 
    regValidate.updateRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.updateAccount)
);

// Route to post the account password change
router.post("/password-change/",
    utilities.checkLogin, 
    regValidate.passwordRules(),
    regValidate.checkPasswordData,
    utilities.handleErrors(accountController.changePassword)
);

router.get("/logout/", utilities.handleErrors(accountController.accountLogout))

module.exports = router;