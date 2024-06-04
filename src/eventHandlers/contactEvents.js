import { getContactsData } from "../services/dataService.js";

export async function setupContactEvents() {
  const contactsData = await getContactsData();
  modalData.contactsData = contactsData;
  listContact(contactsData);
}

// 커스텀 이벤트 생성 및 발생시키기
export function triggerContactUpdateEvent(updatedContacts) {
  if (updatedContacts) {
    const event = new CustomEvent("contactUpdate", {
      detail: { updatedContacts },
    });
    window.dispatchEvent(event);
  }
}

window.addEventListener("contactUpdate", async (e) => {
  if (modalData) {
    modalData.selectContact = e.detail.updatedContacts;
    await listContact();
    console.log('contactUpdate 발생');
  }
});


// listContact 함수 내에서 연락처 데이터를 가져와서 DOM에 반영
export async function listContact() {
  console.log('listContact function called');
  const fetchData = await getContactsData();

  const contactList = document.getElementById("contact-list");
  contactList.innerHTML = ""; // 기존 목록 초기화

  // 데이터 그룹화
  const groupedGroup = fetchData.reduce((acc, contact) => {
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

  // 그룹화된 데이터를 기반으로 HTML 요소 생성 및 추가
  Object.values(groupedGroup).forEach((group, i) => {
    // group 타이틀 생성
    const groupTitle = document.createElement("div");
    groupTitle.className =
      "z-10 sticky top-[56px] px-3 py-2 border-t-0 border-b border-l-0 border-r-0 border-gray-200 bg-white";
    const memberCount = group.contacts.length; // 그룹 내 데이터 수 계산
    groupTitle.innerHTML = `<p class="text-sm font-semibold">${Object.keys(groupedGroup)[i]}</p> <div class="absolute top-1/2 -translate-y-1/2 right-4 text-sm tracking-tight text-blue-600">${memberCount}명</div>`;
    contactList.appendChild(groupTitle);

    // group 속한 사용자 목록 생성
    const groupList = document.createElement("ul");
    group.contacts.forEach((contact) => {
      const contactItem = document.createElement("li");
      const contactData = JSON.stringify(contact);
      contactItem.innerHTML = `
        <app-list-card x-on:click="handleDetailClick; if (modalState !== 'detail') { modalOpen = true; modalState = 'detail'; notification = false; }" id="detail" data-contactData='${contactData}' data-group="${group.groupId}">
        </app-list-card>
      `;
      groupList.appendChild(contactItem);
    });
    contactList.appendChild(groupList);
  });

  // 데이터가 비어 있을 때 메시지 추가
  if (fetchData.length === 0) {
    document.getElementById("contact-list").classList.add("h-full");
    const emptyMessageWrap = document.createElement("div");
    emptyMessageWrap.className = "w-full h-full bg-slate-50";
    emptyMessageWrap.innerHTML = `<div class="noData"><p>연락처를 등록해주세요.</p></div>`;
    contactList.appendChild(emptyMessageWrap);
  } else if (fetchData.length > 0) {
    document.getElementById("contact-list").classList.remove("h-full");
  }

  const searchTitle = document.getElementById('searchTitle');
  if (!searchTitle.classList.contains('hidden')) {
    searchTitle.classList.add('hidden');
  }
}

  
// const appListCard = document.querySelectorAll('app-list-card');
// const groupListCard = appListCard.reduce((acc, cur) => {
//   const groupIndex = acc.findIndex(item => item.)
// });
// console.log(groupListCard);