
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
    this.modalOpen = false;
    this.modalState = "";
    this.modalTabState = "";
    this.contactMore = false;
    this.selectContact = "";
    this.notification = false;
    document.body.classList.remove("active", "overflow-hidden");
    document.getElementById("modalBackground").classList.remove("hidden");
  }
}

function handleConfirmClick() {
  this.modalOpen = false;
  this.modalTabState = "";
  this.modalState = "";
  this.notification = true;
  document.getElementById("notificationContainer").innerHTML = '';
}

function handleDetailClick() {
    console.log('----handleDetailClick 실행!', this.modalTabState);
    this.modalTabState = "test";
    console.log('----handleDetailClick 실행!', this.modalTabState);


}