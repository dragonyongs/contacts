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

// if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
//   document.querySelector(".button-tap").style.paddingBottom = "1.5rem";
// }

// iOS 기기인지 여부를 확인하는 함수
function isIOS() {
  console.log('iOS 조건');
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// PWA로 추가된 경우 상단 및 하단 브라우저 요소가 없는지 확인하는 함수
function isPWAWithoutBrowserUI() {
  console.log('PWA 조건');
  return window.matchMedia('(display-mode: standalone)').matches && !window.navigator.standalone;
}

// iOS 기기에서 PWA를 홈 화면에 추가한 경우에만 CSS를 적용
if (isIOS() && isPWAWithoutBrowserUI()) {
  alert('iOS & PWA 조건 확인');
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
