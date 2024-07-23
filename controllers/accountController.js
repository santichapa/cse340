const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { cookie } = require("express-validator");
require("dotenv").config();

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/register", {
        title: "Registration",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav();
    const {account_firstname, account_lastname, account_email, account_password} = req.body;

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcryptjs.hashSync(account_password, 10)
    } catch (error) {
        req.flash("error", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }
    
    const regResult = await accountModel.registerAccount(
        account_firstname, 
        account_lastname, 
        account_email, 
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, ${account_firstname}, you are registered now. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    } else {
        req.flash("error", "Sorry, the registration failed.");
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
        })
    }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    let nav = await utilities.getNav();
    const { account_email, account_password } = req.body;
    const accountData = await accountModel.getAccountByEmail(account_email);
    if (!accountData) {
        req.flash("error", "Please check yout credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
    return
    }
    try {
        if (await bcryptjs.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600})
            if (process.env.NODE_ENV === "development") {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000})
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000})
            }
            return res.redirect("/account/")
        }
    } catch (error) {
        return new Error("Access Forbidden")
    }
}

/* ****************************************
*  Deliver Account Default View
* *************************************** */
async function buildAccountManagement(req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/account-management", {
        title: "Account Management",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver update account view
* *************************************** */
async function buildEditAccount(req, res, next) {
    let nav = await utilities.getNav();
    // let account_id = parseInt(req.params.account_id)
    let account_id = parseInt(res.locals.accountData.account_id)

    accountData = await accountModel.getDataByAccountId(account_id);
    console.log(accountData);
    res.render("account/edit-account", {
        title: "Edit Account",
        nav,
        errors: null,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
        account_id: account_id,
    })
}

/* ****************************************
*  Process account update
* *************************************** */
async function updateAccount(req, res) {
    const {account_firstname, account_lastname, account_email, account_id} = req.body;

    const updateResult = await accountModel.updateAccount(
        account_firstname, 
        account_lastname, 
        account_email,
        parseInt(account_id)
    )
    let nav = await utilities.getNav();
    if (updateResult) {
        req.flash(
            "notice",
            `Congratulations, ${account_firstname}, your account has been updated!`
        )
        res.clearCookie("jwt");
        res.status(201).redirect("/account/")
    } else {
        req.flash("error", "Sorry, the update failed.");
        res.status(501).render("account/account-management", {
            title: "Account Management",
            nav,
        })
    }
}

/* ****************************************
*  Process Password Change
* *************************************** */
async function changePassword(req, res) {
    let nav = await utilities.getNav();
    const {account_password, account_id} = req.body;

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcryptjs.hashSync(account_password, 10)
    } catch (error) {
        req.flash("error", 'Sorry, there was an error processing the new password.')
        res.status(500).redirect("/account/")
    }
    
    const regResult = await accountModel.changePassword(hashedPassword, parseInt(account_id))

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, your password has been reset. Please log in.`
        )
        res.clearCookie("jwt");
        res.status(201).redirect("/account/login")
    } else {
        req.flash("error", "Sorry, the password change failed.");
        res.status(501).render("/account/")
    }
}

/* ****************************************
*  Process Account Logout
* *************************************** */
async function accountLogout(req, res, next) {
    res.clearCookie("jwt");
    res.redirect("../../")
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, buildEditAccount, updateAccount, changePassword, accountLogout }