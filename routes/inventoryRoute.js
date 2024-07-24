// Needed resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const addValidate = require("../utilities/inventory-validation")
const validate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build item detail view by inventory item view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build management view
router.get("/", 
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildManagement));

// Route to build view to add new classification
router.get("/add-classification", 
    utilities.checkLogin,
    utilities.checkAccountType,
    invController.buildAddClassification);

// Route to post the new classification
router.post("/add-classification",
    utilities.checkLogin,
    utilities.checkAccountType,
    addValidate.newClassificationRules(),
    addValidate.checkClassificationName,
    utilities.handleErrors(invController.addNewClassification));

// Route to build view to add new vehicle
router.get("/add-inventory", 
    utilities.checkLogin,
    utilities.checkAccountType,
    invController.buildAddInventory);

// Route to post the new vehicle
router.post("/add-inventory",
    utilities.checkLogin,
    utilities.checkAccountType,
    addValidate.newVehicleRules(),
    addValidate.checkVehicleData,
    utilities.handleErrors(invController.addNewVehicle));

// Route to deliver the Inv management view by classification id
router.get("/getInventory/:classification_id", 
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.getInventoryJSON))

// Route to deliver the Inv approval view
router.get("/getUnapprovedInventory/:inv_id", 
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.getUnapprovedInventoryJSON))

// Route to vehicle edit view    
router.get("/edit/:inv_id", 
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildEditInventory))

// Route to post inventory update    
router.post("/edit/", 
    utilities.checkLogin,
    utilities.checkAccountType,
    validate.newVehicleRules(),
    validate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

// Route to delete confirmation view
router.get("/delete/:inv_id", 
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildDeleteConfirmation))

// Route to delete a vehicle
router.post("/delete/", 
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.deleteInventoryItem))

// Route to approve or delete classification view
router.get("/classification-approval/", 
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildClassApproval))

// Route to approve classification
router.post("/classification-approval/approve", 
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.approveClassification))

// Route to delete classification
router.post("/classification-approval/reject", 
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.rejectClassification))

// Route to approve or delete inventory view
router.get("/inventory-approval/", 
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildInventoryApproval))

// Route to approve inventory
router.post("/inventory-approval/approve", 
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.approveInventoryItem))

// Route to delete inventory
router.post("/inventory-approval/reject", 
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.rejectInventoryItem))

module.exports = router;