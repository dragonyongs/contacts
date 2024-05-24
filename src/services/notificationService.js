// import { triggerContactUpdateEvent } from "../eventHandlers/contactEvents.js";

export function notification(message) {
    console.log('notification show!');
    let notificationContainer = document.getElementById('notificationContainer');
    notificationContainer.setAttribute('x-transition:enter', 'transition ease-out duration-200');
    notificationContainer.setAttribute('x-transition:enter-start', 'transform translate-x-20 opacity-0');
    notificationContainer.setAttribute('x-transition:enter-end', 'transform translate-x-0 opacity-100');
    notificationContainer.setAttribute('x-transition:leave', 'transition ease-in duration-300');
    notificationContainer.setAttribute('x-transition:leave-start', 'transform translate-y-0 opacity-100');
    notificationContainer.setAttribute('x-transition:leave-end', 'transform translate-y-20 opacity-0');

    // 알림 모달 요소 생성
    let notificationDiv = document.createElement('div');
    notificationDiv.className = 'z-50 fixed bottom-20 left-1/2 -translate-x-1/2 container h-64 p-8 rounded-tr-3xl rounded-tl-3xl bg-blue-700';
    
    // 알림 모달 내부 구성 요소 추가
    notificationDiv.innerHTML = `
        <div class="header mb-8">
            <p class="font-normal text-md text-blue-200">알림</p>
            <button class="remove-overflow absolute top-6 right-6 bg-transparent text-white rounded-full shadow-xl w-8 h-8 flex items-center justify-center focus:bg-blue-700 active:bg-blue-800"
                @click="handleOutsideClick">
                <ion-icon name="close-outline" size="large"></ion-icon>
            </button>
        </div>
        <div class="content relative min-h-32">
            <div class="w-11/12">
                <p class="mb-6 font-semibold text-xl text-white">${message}</p>
                <app-button type="button" role="button" class="small remove-overflow w-48 font-semibold text-2xl text-black bg-white rounded-full" @click="handleConfirmClick">
                    <span slot="label">확인</span>
                </app-button>
            </div>
            <div class="absolute bottom-0 right-0 w-24 h-24 rounded-full bg-white overflow-hidden flex justify-center items-center">
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