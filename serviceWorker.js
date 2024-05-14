const CACHE_NAME = "Contacts-v1.4";
const urlsToCache = [
  "./",
  "./index.html",
  "./src/styles/font-pretendard.css",
  "./src/styles/main.css",
  "./src/assets/alpinejs@3xx_cdn.min.js",
  "./src/assets/dexie.js",
  "./src/assets/tailwindcss.js",
  "./src/assets/xlsx.full.min.js",
  "./src/components/Button/app-button.js",
  "./src/components/Button/app-button.css",
  "./src/components/ListCard/app-list-card.js",
  "./src/components/ListCard/app-list-card.css",
  "./src/components/ModalInput/app-modal-input.js",
  "./src/components/ModalInput/app-modal-input.css",
  "./src/components/ModalSelect/app-modal-select.js",
  "./src/components/ModalSelect/app-modal-select.css",
  "./src/components/TabButton/app-tab-button.js",
  "./src/components/TabButton/app-tab-button.css",
  "./src/app.js",
  "./src/main.js",
  "./src/eventHandlers/contactEvents.js",
  "./src/eventHandlers/modalEvents.js",
  "./src/utils/helpers.js",
  "./src/utils/modalUtils.js",
  "./src/services/dataDB.js",
  "./src/services/dataService.js",
  "./src/services/excelService.js",
  "./src/services/uiServices.js",
  "./public/favicon.ico",
  "./public/manifest.json",
  "./public/fonts/Pretendard/Pretendard-Black.woff",
  "./public/fonts/Pretendard/Pretendard-Bold.woff",
  "./public/fonts/Pretendard/Pretendard-ExtraBold.woff",
  "./public/fonts/Pretendard/Pretendard-ExtraLight.woff",
  "./public/fonts/Pretendard/Pretendard-Light.woff",
  "./public/fonts/Pretendard/Pretendard-Medium.woff",
  "./public/fonts/Pretendard/Pretendard-Regular.woff",
  "./public/fonts/Pretendard/Pretendard-SemiBold.woff",
  "./public/fonts/Pretendard/Pretendard-Thin.woff",
  "./public/fonts/Pretendard/PretendardVariable.woff2",
  "./public/icons/common/icon-notification.png",
  "./public/icons/common/icon-animation-notification.gif",
  "./public/icons/common/icon-animation-message.gif",
  "./public/icons/common/icon-animation-bell.gif",
  "./public/icons/common/icon-badge.png",
  "./public/icons/common/img-notification.png",
];

// 서비스 워커 설치 이벤트
self.addEventListener("install", function (event) {
  // 캐시할 리소스 지정
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// 캐시 사용 로직
self.addEventListener("fetch", (event) => {
  // URL이 'http' 또는 'https'로 시작하는지 확인
  if (!event.request.url.startsWith("http")) {
    console.log(`캐시 건너뛰기: ${event.request.url}`);
    // 이벤트에 대한 응답으로 직접 네트워크 요청을 수행
    return fetch(event.request);
  }

  event.respondWith(
    (async () => {
      try {
        const fetchRequest = event.request.clone();
        const response = await fetch(fetchRequest);
        const cache = await caches.open(CACHE_NAME);

        // 응답을 캐시에 저장. 이 때 cache.put 메서드가 완료될 때까지 기다립니다.
        cache
          .put(event.request.url, response.clone())
          .catch((err) => console.error("캐시 저장 실패:", err));

        return response;
      } catch (error) {
        const cacheResponse = await caches.match(event.request);
        if (cacheResponse) {
          console.log(`캐시에서 찾은 응답: ${event.request.url}`);
          return cacheResponse;
        } else {
          console.log(`캐시에서 찾을 수 없음: ${event.request.url}`);
          // 캐시에서도 찾을 수 없는 경우, 사용자에게 오류를 표시하거나 기본 대체 콘텐츠를 제공할 수 있습니다.
          // 예: return caches.match('/fallback.html');
        }
      }
    })()
  );
});
