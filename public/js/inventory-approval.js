"use strict";

// Get a list of items in inventory based on the classification_id
let inventoryList = document.querySelector("#inventoryList");

inventoryList.addEventListener("change", function () {
  let inv_id = inventoryList.value;
  console.log(`inv_id is: ${inv_id}`);


  
  
  let invIdURL = "/inv/getUnapprovedInventory/" + inv_id;
  fetch(invIdURL)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw Error("Network response was not OK");
    })
    .then(function (data) {
      console.log(data)

      const index = data.findIndex(item => item.inv_id == inv_id);
      buildInventoryDisplay(data[index]);
    })
    .catch(function (error) {
      console.log("There was a problem: ", error.message);
    });
});

// Build inventory items into HTML table components and inject into DOM
function buildInventoryDisplay(data) {
  let inventoryDisplay = document.querySelector("#invDisplayFieldset");  
  inventoryDisplay.innerHTML = `
    <label>Make <input type="text" name="inv_make" id="inv_make" value="${data.inv_make}" required readonly></label>
    <label>Model <input type="text" name="inv_model" id="inv_model" value="${data.inv_model}" required readonly></label>
    <label>Description<textarea name="inv_description" id="inv_description" cols="30" rows="7" required readonly>${data.inv_description}</textarea></label>
    <label>Image Path <input type="text" name="inv_image" id="inv_image" value="${data.inv_image}" required readonly></label>
    <label>Thumbnail Path <input type="text" name="inv_thumbnail" id="inv_thumbnail" value="${data.inv_thumbnail}" required readonly></label>
    <label>Price <input type="number" name="inv_price" id="inv_price" value="${data.inv_price}" required readonly></label>
    <label>Year<input type="number" name="inv_year" id="inv_year" value="${data.inv_year}" required readonly></label>
    <label>Miles<input type="number" name="inv_miles" id="inv_miles" value="${data.inv_miles}" required readonly></label>
    <label>Color <input type="text" name="inv_color" id="inv_color" value="${data.inv_color}" required readonly></label>
  `
    // Display the contents in the inventory display view
}
