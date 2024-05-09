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
    document.body.classList.remove("active", "overflow-hidden");
    document.getElementById("modalBackground").classList.remove("hidden");
  }

}