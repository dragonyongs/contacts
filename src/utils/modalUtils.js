
function handleOutsideClick() {
  if (
    this.modalState === "detail" &&
    (this.modalTabState === "add" ||
      this.modalTabState === "search" ||
      this.modalTabState === "edit" ||
      this.modalTabState === "data")
  ) {
    this.modalOpen = true;
    this.modalState = "detail";
    this.modalTabState = "";
  } else {
  console.log('handleOutsideClick 1) this.notification', this.notification);

    this.modalOpen = false;
    this.modalState = "";
    this.modalTabState = "";
    this.contactMore = false;
    this.selectContact = "";
    this.notification = false;
    console.log('handleOutsideClick 2) this.notification', this.notification);
    document.body.classList.remove("active", "overflow-hidden");
    document.getElementById("modalBackground").classList.remove("hidden");
  }
}

function handleConfirmClick() {
  console.log('handleConfirmClick 1) this.notification', this.notification);
  this.modalOpen = false;
  this.modalTabState = "";
  this.modalState = "";
  this.notification = true;
  document.getElementById("notificationContainer").innerHTML = '';
  console.log('handleConfirmClick 2) this.notification', this.notification);
}
