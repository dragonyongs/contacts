import { initializeApp } from "./app.js";

initializeApp();

// 각 모달의 외부 클릭 이벤트에 대한 처리
document.addEventListener("click", function (event) {
  const isInsideModal = event.target.closest(".modal");
  if (!isInsideModal) {
    // 각 모달이 닫힐 때 'close-modal' 이벤트를 발생시킵니다.
    document.dispatchEvent(
      new CustomEvent("close-modal", { detail: { open: false } })
    );
  }
});