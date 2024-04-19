function handleOutsideClick() {
  console.log("handleOutsideClick 실행");

  if (this.modalState === "add" || "search" || "data") {
    this.modalOpen = false;
    document.body.classList.remove("active", "overflow-hidden");
  }
}
