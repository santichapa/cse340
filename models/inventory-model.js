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


module.exports = {getClassifications, getInventoryByClassificationId, getVehicleByInventoryId, addNewClassification, addNewVehicle, updateInventory }