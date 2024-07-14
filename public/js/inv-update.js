// const classList = document.querySelector("#classificationList")
// const classId = document.queerySelector("#classId")
// classList.value = classId.value


const form = document.querySelector("#updateForm")
form.addEventListener("change", function () {
  const updateBtn = document.querySelector("#updateBtn")
  updateBtn.removeAttribute("disabled")
})