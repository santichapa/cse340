const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  // console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    if (row.classification_approval == true) {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
    }
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      if (vehicle.inv_approval == true) {
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + ' details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      }
      
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the detail view HTML
* ************************************ */
Util.buildVehicleDetail = async function (data) {
  const v = data[0]
  let detail
  if (data.length > 0 && v.inv_approval == true) {
    detail = `
    <div class="detailview">
    <img src="${v.inv_image}" alt="Image of ${v.inv_make} ${v.inv_model}">
    <div class="details">
    <h2>${v.inv_make} ${v.inv_model} Details</h2>
      <ul>
          <li><strong>Price: $${new Intl.NumberFormat('en-US').format(v.inv_price)}</strong></li>
          <li><strong>Description:</strong> ${v.inv_description}</li>
          <li><strong>Color:</strong> ${v.inv_color}</li>
          <li><strong>Miles:</strong> ${new Intl.NumberFormat('en-US').format(v.inv_miles)}</li>
      </ul>
    </div>
    </div>`
  } else {
    detail = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return detail
}

/* **************************************
* Build the classification select list for the add vehicle view
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" class="classList" required>'
  classificationList += "<option value='' disabled selected>Choose a Classification</option>"
  data.rows.forEach((row) => {
    if (row.classification_approval == true) {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    }
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in.")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      })
  } else {
    next()
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 *  Check Not Loggedin
 * ************************************ */
Util.checkNotLoggedin = (req, res, next) => {
  if (res.locals.loggedin) {
    return res.redirect("../../")
  } else {
    next();
  }
}

/* ****************************************
 *  Check Employee Status
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
  accountType = res.locals.accountData.account_type
  if (accountType === "Employee" || accountType === "Admin") {
    next();
  } else {
    req.flash("error", "Access Unauthorized")
    return res.redirect("../../")
  }
}

/* **************************************
* Build the classification select list for the classification approval
* ************************************ */
Util.buildUnapprovedClassificationList = async function (classification_id = null) {
  let data = await invModel.getUnapprovedClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" class="classList" required>'
  classificationList += "<option value='' disabled selected>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* **************************************
* Build the inventory select list for the inventory item approval
* ************************************ */
Util.buildUnapprovedInventoryList = async function (inv_id = null) {
  let data = await invModel.getUnapprovedInventory()
  let inventoryList =
    '<select name="inv_id" id="inventoryList" class="classList" required>'
    inventoryList += "<option value='' disabled selected>Choose a vehicle</option>"
  data.forEach((row) => {
    inventoryList += '<option value="' + row.inv_id + '"'
    if (
      inv_id != null &&
      row.inv_id == inv_id
    ) {
      inventoryList += " selected "
    }
    inventoryList += `>${row.inv_year} ${row.inv_make} ${row.inv_model}</option>`
  })
  inventoryList += "</select>"
  return inventoryList
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util