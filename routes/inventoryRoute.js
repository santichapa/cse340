// Needed resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const addValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build item detail view by inventory item view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build management view
router.get("/management", utilities.handleErrors(invController.buildManagement));

// Route to build view to add new classification
router.get("/add-classification", invController.buildAddClassification);

// Route to post the new classification
router.post("/add-classification",
    addValidate.newClassificationRules(),
    addValidate.checkClassificationName,
    utilities.handleErrors(invController.addNewClassification));

// Route to build view to add new vehicle
router.get("/add-inventory", invController.buildAddInventory);

// Route to post the new vehicle
router.post("/add-inventory",
    addValidate.newVehicleRules(),
    addValidate.checkVehicleData,
    utilities.handleErrors(invController.addNewVehicle));

module.exports = router;