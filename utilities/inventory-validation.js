const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
  *  New Classification Data Validation Rules
  * ********************************* */
validate.newClassificationRules = () => {
    return [
      // name is required and must be string
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isAlpha()
        .isLength({ min: 2 })
        .withMessage("Please provide a valid classification name."), // on error this message is sent.
    ]
  }

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassificationName = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors)
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors,
        title: "Add New Classification",
        nav,
        classification_name,
      })
      return
    }
    next()
  }

  /*  **********************************
  *  New Vehicle Data Validation Rules
  * ********************************* */
validate.newVehicleRules = () => {
  return [
    // classification is required and must be selected
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please select a classification"), // on error this message is sent.
    // make is required and must be string
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isAlphanumeric()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid make."), // on error this message is sent.
    // model is required and must be string
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isAlphanumeric()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid model."), // on error this message is sent.
    // description is required and must be string
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a valid description."), // on error this message is sent.
    // image path is required and must be string
    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid image path."), // on error this message is sent.
    // thumbnail path is required and must be string
    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid thumbnail path."), // on error this message is sent.
    // price is required and must be a digit or integer
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid price."), // on error this message is sent.
    // year is required and must be int
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .isLength({ min: 4, max:4 })
      .withMessage("Please provide a valid year."), // on error this message is sent.
    // miles is required and must be int
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid amount of miles"), // on error this message is sent.
    // color is required and must be string
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isAlpha()
      .isLength({ min: 2 })
      .withMessage("Please provide a valid color."), // on error this message is sent.
  ]
}

/* ******************************
 * Check data and return errors or continue to add vehicle
 * ***************************** */
validate.checkVehicleData = async (req, res, next) => {
  const { classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
      console.log(errors)
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
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
      inv_color,
    })
    return
  }
  next()
}
  
  module.exports = validate