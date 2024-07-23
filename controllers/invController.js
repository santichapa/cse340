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
  if (data[0].classification_approval == true) { // if the classification is approved then the page is loaded, else redirected to homepage
      res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
      })
  } else {
    res.redirect("../../")
  }
  
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
  if (data[0].inv_approval == true) {
    res.render("./inventory/detail", {
      title: `${vehicleName}`,
      nav,
      detail
    })
  } else {
    res.redirect("../../")
  }
  
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationList,
  })
}

/* ***************************
 *  Build 'add classification' view
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit vehicle view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  let inv_id = parseInt(req.params.inv_id)

  let invData = await invModel.getVehicleByInventoryId(inv_id)
  invData = invData[0]
  const itemName = `${invData.inv_make} ${invData.inv_model}`
  res.render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    errors: null,
    classificationList: classificationList,
    inv_id: inv_id,
    inv_make: invData.inv_make,
    inv_model: invData.inv_model,
    inv_year: invData.inv_year,
    inv_description: invData.inv_description,
    inv_image: invData.inv_image,
    inv_thumbnail: invData.inv_thumbnail,
    inv_price: invData.inv_price,
    inv_miles: invData.inv_miles,
    inv_color: invData.inv_color,
    classification_id: invData.classification_id,
  })
}

/* ****************************************
*  Process update inventory data
* *************************************** */
invCont.updateInventory = async function (req, res) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  const {
    inv_id,
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
  
  const updateResult = await invModel.updateInventory(
    inv_id,
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

  const itemName = `${inv_make} ${inv_model}`
  if (updateResult) {
      req.flash(
          "notice",
          `Congratulations, "${inv_color} ${inv_make} ${inv_model} ${inv_year}" Updated.`
      )
      res.status(201).render("inventory/management", {
          title: "Edit " + itemName,
          nav,
          errors: null,
          classificationList,
      })
  } else {
      req.flash("notice", "Sorry, the inventory update failed.");
      res.status(501).render("inventory/edit-inventory", {
          title: "Edit " + itemName,
          nav,
          classificationList: classificationList,
          classification_id: classification_id,
          inv_make: inv_make,
          inv_model: inv_model,
          inv_description: inv_description,
          inv_image: inv_image,
          inv_thumbnail: inv_thumbnail,
          inv_price: inv_price,
          inv_year: inv_year,
          inv_miles: inv_miles,
          inv_color: inv_color,
          inv_id,
      })
  }
}

/* ***************************
 *  Build delete confirmation view
 * ************************** */
invCont.buildDeleteConfirmation = async function (req, res, next) {
  let nav = await utilities.getNav();
  let inv_id = parseInt(req.params.inv_id)

  let invData = await invModel.getVehicleByInventoryId(inv_id)
  invData = invData[0]
  const itemName = `${invData.inv_make} ${invData.inv_model}`
  res.render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: inv_id,
    inv_make: invData.inv_make,
    inv_model: invData.inv_model,
    inv_year: invData.inv_year,
    inv_price: invData.inv_price,
  })
}

/* ****************************************
*  Process delete inventory item
* *************************************** */
invCont.deleteInventoryItem = async function (req, res) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();

  const { inv_id } = req.body
  
  const deleteResult = await invModel.deleteInventoryItem(inv_id)
  if (deleteResult) {
      req.flash(
          "notice",
          `Congratulations, vehicle Deleted.`
      )
      res.status(201).render("inventory/management", {
          title: "Vehicle Management",
          nav,
          errors: null,
          classificationList,
      })
  } else {
      req.flash("error", "Sorry, the inventory update failed.");
      res.status(501).render("inventory/management", {
        title: "Vehicle Management (error)",
        nav,
        classificationList,
      })
  }
}


module.exports = invCont