import { setupContactEvents } from "./eventHandlers/contactEvents.js";
import { setupExcelService } from "./services/excelService.js";
import { getDataDB } from "./services/dataDB.js";

export async function initializeApp() {
  console.log("app.jsinitializeApp 실행!");
  const database = await getDataDB(); // 데이터베이스 초기화
  setupContactEvents(); // 연락처 이벤트 설정
  setupExcelService(database); // Excel 서비스 설정
  deleteContact(); // 삭제 함수
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./src/serviceWorker.js")
      .then((registration) => {
        console.log("ServiceWorker registered with scope:", registration.scope);
      })
      .catch((error) => {
        console.error("ServiceWorker registration failed:", error);
      });
  });
}

if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
  // 아이폰, 아이패드, 아이팟 사용자를 위한 CSS 적용
  document.querySelector(".button-tap").style.paddingBottom = "1.5rem";
}