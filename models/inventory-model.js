const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1`,
    [classification_id]
  )
  return data.rows
  } catch (error) {
    console.error("getClassificationById error " + error)
  }
}

/* ***************************
 *  Get inventory item by inv_id
 * ************************** */
async function getVehicleByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
      WHERE inv_id = $1
      ORDER BY inv_id
      `,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryItemByInventoryId error" + error)
  }
}

/* *****************************
*   Add new classification
* *************************** */
async function addNewClassification(classification_name) {
  try {
      const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
      return await pool.query(sql, [classification_name])
  } catch (error) {
      console.log(error)
      return error.message
  }
}

/* *****************************
*   Add new vehicle
* *************************** */
async function addNewVehicle(classification_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color) {
  try {
      const sql = "INSERT INTO public.inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
      return await pool.query(sql, [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color])
  } catch (error) {
      console.log(error)
      return error.message
  }
}

/* *****************************
*   Update inventory
* *************************** */
async function updateInventory(
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
  inv_color) {
  try {
      const sql = "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
      return await pool.query(sql, [inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id, inv_id])
  } catch (error) {
      console.log(error)
      return error.message
  }
}

/* *****************************
 *   Delete inventory Item
 * *************************** */
async function deleteInventoryItem(inv_id) {
  try {
    console.log(inv_id)
    const sql = "DELETE FROM inventory WHERE inv_id = $1"
    return await pool.query(sql, [inv_id])
  } catch (error) {
    console.log(error)
    new Error("Delete Inventory Error")
  }
}

/* ***************************
 *  Get all unapproved classification data
 * ************************** */
async function getUnapprovedClassifications(){
  return await pool.query("SELECT * FROM public.classification WHERE classification_approval = false ORDER BY classification_name")
}

/* *****************************
*   Approve classification
* *************************** */
async function approveClassification(classification_id, account_id) {
  try {
      const sql = "UPDATE public.classification SET classification_approval = true, classification_approvedbyid = $2 WHERE classification_id = $1 RETURNING *"
      return await pool.query(sql, [classification_id, account_id])
  } catch (error) {
      console.log(error)
      return error.message
  }
}

/* *****************************
 *   Delete rejected classification
 * *************************** */
async function rejectClassification(classification_id) {
  try {
    const sql = "DELETE FROM classification WHERE classification_id = $1"
    return await pool.query(sql, [classification_id])
  } catch (error) {
    console.log(error)
    new Error("Delete Classification Error")
  }
}

/* ***************************
 *  Get inventory item that is not approved
 * ************************** */
async function getUnapprovedInventory() {
  try {
    const data = await pool.query(`SELECT * FROM public.inventory WHERE inv_approval = false ORDER BY inv_id`)
    // console.log(data)
    return data.rows
  } catch (error) {
    console.error("getUnapprovedInventory error" + error)
  }
}

/* *****************************
*   Approve classification
* *************************** */
async function approveInventoryItem(inv_id, account_id) {
  try {
      const sql = "UPDATE public.inventory SET inv_approval = true, inv_approvedbyid = $2 WHERE inv_id = $1 RETURNING *"
      return await pool.query(sql, [inv_id, account_id])
  } catch (error) {
      console.log(error)
      return error.message
  }
}

/* *****************************
 *   Delete rejected inventory Item
 * *************************** */
async function rejectInventoryItem(inv_id) {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1"
    return await pool.query(sql, [inv_id])
  } catch (error) {
    console.log(error)
    new Error("Delete Classification Error")
  }
}

module.exports = { 
  getClassifications, 
  getInventoryByClassificationId, 
  getVehicleByInventoryId, 
  addNewClassification, 
  addNewVehicle, 
  updateInventory, 
  deleteInventoryItem, 
  getUnapprovedClassifications,
  approveClassification,
  rejectClassification,
  getUnapprovedInventory,
  approveInventoryItem,
  rejectInventoryItem
}