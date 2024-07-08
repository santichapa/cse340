const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build detail by inventory ID
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getVehicleByInventoryId(inv_id)
  const detail = await utilities.buildVehicleDetail(data)
  let nav = await utilities.getNav()
  const vehicleName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
  res.render("./inventory/detail", {
    title: `${vehicleName}`,
    nav,
    detail
  })
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process new classification
* *************************************** */
invCont.addNewClassification = async function (req, res) {
  let nav = await utilities.getNav();
  const {classification_name} = req.body;
  
  const addClassResult = await invModel.addNewClassification(classification_name)

  if (addClassResult) {
      req.flash(
          "notice",
          `Congratulations, new classification "${classification_name}" Added.`
      )
      res.status(201).render("inventory/add-classification", {
          title: "Add New Classification",
          nav,
          errors: null,
      })
  } else {
      req.flash("notice", "Sorry, the registration failed.");
      res.status(501).render("inventory/add-classification", {
          title: "Add New Classification",
          nav,
      })
  }
}

/* ***************************
 *  Build add vehicle view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    errors: null,
    classificationList,
  })
}

/* ****************************************
*  Process new vehicle
* *************************************** */
invCont.addNewVehicle = async function (req, res) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  } = req.body;
  
  const addVehicleResult = await invModel.addNewVehicle(
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color)

  if (addVehicleResult) {
      req.flash(
          "notice",
          `Congratulations, "${inv_color} ${inv_make} ${inv_model} ${inv_year}" Added.`
      )
      res.status(201).render("inventory/add-inventory", {
          title: "Add New Vehicle",
          nav,
          errors: null,
          classificationList,
      })
  } else {
      req.flash("notice", "Sorry, the registration failed.");
      res.status(501).render("inventory/add-inventory", {
          title: "Add New Vehicle (error)",
          nav,
          classificationList,
          classification_id,
          inv_make,
          inv_model,
          inv_description,
          inv_image,
          inv_thumbnail,
          inv_price,
          inv_year,
          inv_miles,
          inv_color
      })
  }
}

module.exports = invCont