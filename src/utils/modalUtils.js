function handleOutsideClick(event) {
  console.log("handleOutsideClick 실행");
  const isInsideModal = event.target.closest(".modal");
  document.body.classList.remove("overflow-hidden");

  // 모달 외부를 클릭한 경우
  if (!isInsideModal) {
    // 현재 열린 모달 상태에 따라 modalOpen을 false로 설정
    if (this.modalState !== "") {
      this.modalOpen[this.modalState] = false;
    }

    // 특정한 모달 상태에 대해서만 overflow-hidden 클래스 제거
    if (this.modalState === "detail") {
      document.body.classList.remove("overflow-hidden");
    }
  }
}