import {
  setupContactEvents,
  listContact,
} from "./eventHandlers/contactEvents.js";
// import {
//   deleteContact,
//   saveContact,
// } from "../src/eventHandlers/contactFunction.js";
import { getDataDB } from "./services/dataDB.js";
import { setupExcelService } from "./services/excelService.js";

export async function initializeApp() {
  console.log("app.js initializeApp 실행!");
  const database = await getDataDB(); // 데이터베이스 초기화
  setupContactEvents(); // 연락처 이벤트 설정
  setupExcelService(database);
  // saveContact();
  // deleteContact(); // 삭제 함수
  //전역 데이터 호출
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("../serviceWorker.js")
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

const detailColor = "#22326E";
const contactWrapElement = document.querySelector(".contactWrap");
contactWrapElement.addEventListener("click", function () {
  changeThemeColor(detailColor);
});

function changeThemeColor(color) {
  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute("content", color);
}
