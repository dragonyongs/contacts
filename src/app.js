import { setupContactEvents } from "./eventHandlers/contactEvents.js";
import { getDataDB } from "./services/dataDB.js";
import { setupExcelService } from "./services/excelService.js";
import { handleSearchInput } from './eventHandlers/searchEventHandler.js';

const searchInput = document.getElementById('searchForm');
searchInput.addEventListener('input', handleSearchInput);

export async function initializeApp() {
  console.log("app.js initializeApp 실행!");
  const database = await getDataDB(); // 데이터베이스 초기화
  setupContactEvents(); // 연락처 이벤트 설정
  setupExcelService(database);
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
