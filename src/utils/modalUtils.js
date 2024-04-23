function handleOutsideClick() {
  console.log("handleOutsideClick 실행");

  if (this.modalState === "add" || "search" || "data" || "detail" || "edit") {
    this.modalOpen = false;
    this.modalState = '';
    document.body.classList.remove("active", "overflow-hidden");
  }

}
