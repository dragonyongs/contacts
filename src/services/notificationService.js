// import { triggerContactUpdateEvent } from "../eventHandlers/contactEvents.js";

export function notification(message) {
    console.log('notification show!');
    var notificationContainer = document.getElementById('notificationContainer');
    
    // 알림 모달 요소 생성
    var notificationDiv = document.createElement('div');
    notificationDiv.className = 'z-50 fixed bottom-20 left-0 w-full h-64 p-8 rounded-tr-3xl rounded-tl-3xl bg-blue-700';

    // 알림 모달 내부 구성 요소 추가
    notificationDiv.innerHTML = `
        <div class="header mb-8">
            <p class="font-normal text-md text-blue-200">알림</p>
            <button class="remove-overflow absolute top-6 right-6 bg-white rounded-full shadow-xl w-8 h-8 flex items-center justify-center border focus:bg-gray-100 active:bg-gray-200"
                @click="handleOutsideClick">
                <ion-icon name="close-outline" size="large"></ion-icon>
            </button>
        </div>
        <div class="content relative h-full">
            <p class="font-semibold text-2xl text-white">${message}</p>
            <div class="absolute bottom-9 right-0 w-28 h-28 rounded-full bg-white overflow-hidden flex justify-center items-center">
                <img src="./public/icons/common/icon-animation-bell.gif" class="w-10/12" alt="">
            </div>
        </div>
    `;
    
    // 알림 모달을 컨테이너에 추가
    notificationContainer.appendChild(notificationDiv);
}    
// 일정 시간이 지난 후에 모달을 제거 (여기서는 3초 후)
// setTimeout(function() {
//     notificationDiv.remove();
// }, 3000);