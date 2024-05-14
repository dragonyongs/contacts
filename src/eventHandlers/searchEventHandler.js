import { searchDatabase } from '../services/searchService.js';
import { clearList, blankMessage } from '../utils/helpers.js';
// import { listContact } from "../eventHandlers/contactEvents.js";
// import { getContactsData } from "../services/dataService.js";

export function handleSearchInput(event) {
    // const contactData = getContactsData();
    const modalBackground = document.getElementById('modalBackground');
    const searchText = event.target.value.toLowerCase();

    if (searchText === '') {
        modalBackground.classList.remove('hidden');
        document.body.classList.add("active", "overflow-hidden");
        clearList('contact-list'); // 검색 입력값이 없는 경우 목록 초기화
    } else {
        modalBackground.classList.add('hidden');
        document.body.classList.remove("active", "overflow-hidden");
    }

    searchDatabase(searchText)
        .then(results => {
            if (results.length === 0) {
                clearList('contact-list'); // 검색 입력값이 없는 경우 목록 초기화
                // listContact(contactData);
                console.log("일치하는 값이 없다.");
                blankMessage('contact-list', '일치하는 결과가 없습니다.');
            } else {
                updateList(results);
            }
        })
        .catch(error => {
            console.error('Error searching:', error);
        });
}

export function updateList(results) {
    const contactList = document.getElementById("contact-list");
    contactList.innerHTML = ""; // 기존 목록 초기화

    // 데이터 그룹화
    const groupedGroup = results.reduce((acc, contact) => {
        if (!contact.contact_group) {
            contact.contact_group = "미지정";
        }

        const key = contact.contact_group;

        if (!acc[key]) {
            acc[key] = [];
        }

        acc[key].push(contact);
        return acc;
    }, {});
    console.log('results', results);
    if (results.length === 0) {


    } else {
        // 그룹화된 데이터를 기반으로 HTML 요소 생성 및 추가
        Object.keys(groupedGroup).forEach((contact_group) => {
            // group 타이틀 생성
            const groupTitle = document.createElement("div");
            groupTitle.className =
                "z-10 sticky top-[56px] px-3 py-2 border-t-0 border-b border-l-0 border-r-0 border-gray-200 bg-white";
            const memberCount = groupedGroup[contact_group].length; // 그룹 내 데이터 수 계산
            groupTitle.innerHTML = `<p class="text-sm font-semibold">${contact_group}</p> <div class="absolute top-1/2 -translate-y-1/2 right-4 text-sm tracking-tight text-blue-600">${memberCount}명</div>`;
            contactList.appendChild(groupTitle);

            // group 속한 사용자 목록 생성
            const groupList = document.createElement("ul");
            groupedGroup[contact_group].forEach((contact) => {
                const contactItem = document.createElement("li");
                const contactData = JSON.stringify(contact);
                contactItem.innerHTML = `
                <app-list-card x-on:click="if (modalState !== 'detail') { modalOpen = true; modalState = 'detail'; notification = false; }" id="detail" data-contactData='${contactData}'>
                </app-list-card>
            `;
                groupList.appendChild(contactItem);
            });
            contactList.appendChild(groupList);
        });
    }
    // if (!results) {
    //     console.log('입력 값이 존재하지 않습니다.');
    // }
}
