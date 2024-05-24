import { searchDatabase } from '../services/searchService.js';
import { clearList, blankMessage } from '../utils/helpers.js';

export function handleSearchInput(event) {
    const modalBackground = document.getElementById('modalBackground');
    const searchTitle = document.getElementById('searchTitle');
    const searchText = event.target.value.toLowerCase();

    if (searchText === '') {
        modalBackground.classList.remove('hidden');
        document.body.classList.add("active", "overflow-hidden");
        clearList('contact-list'); // 검색 입력값이 없는 경우 목록 초기화
        searchTitle.classList.add('hidden');
    } else {
        modalBackground.classList.add('hidden');
        document.body.classList.remove("active", "overflow-hidden");
        searchTitle.classList.remove('hidden');
    }

    searchDatabase(searchText)
        .then(results => {
            if (results.length === 0) {
                clearList('contact-list'); // 검색 입력값이 없는 경우 목록 초기화
                blankMessage('contact-list', '일치하는 결과가 없습니다.');
            } else {
                searchTitle.querySelector("span").innerText = searchText;
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
            acc[key] = {
                groupId: `${Math.floor(Math.random() * 1000)}`,
                contacts: []
            };
        }

        acc[key].contacts.push(contact);

        return acc;
    }, {});

    if (results.length !== 0) {
        // 그룹화된 데이터를 기반으로 HTML 요소 생성 및 추가
        Object.values(groupedGroup).forEach((result, i) => {
            // group 타이틀 생성
            const groupTitle = document.createElement("div");
            groupTitle.className =
                "z-10 sticky top-[56px] px-3 py-2 border-t-0 border-b border-l-0 border-r-0 border-gray-200 bg-white";
            const memberCount = result.contacts.length; // 그룹 내 데이터 수 계산
            groupTitle.innerHTML = `<p class="text-sm font-semibold">${Object.keys(groupedGroup)[i]}</p> <div class="absolute top-1/2 -translate-y-1/2 right-4 text-sm tracking-tight text-blue-600">${memberCount}명</div>`;
            contactList.appendChild(groupTitle);

            // group 속한 사용자 목록 생성
            const groupList = document.createElement("ul");
            result.contacts.forEach((contact) => {
                const contactItem = document.createElement("li");
                const contactData = JSON.stringify(contact);
                contactItem.innerHTML = `
                <app-list-card x-on:click="handleDetailClick; if (modalState !== 'detail') { modalOpen = true; modalState = 'detail'; notification = false; };" id="detail" data-contactData='${contactData}' data-group="${result.groupId}">
                </app-list-card>
            `;
                groupList.appendChild(contactItem);
            });
            contactList.appendChild(groupList);
        });
    }
}
