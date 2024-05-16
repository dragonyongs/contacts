import { getContactsData } from "../services/dataService.js";
import { handleExportToExcel } from "../services/excelService.js";
import { setFormDataCallback } from "../components/Button/app-button.js";
// import { getDataDB } from "../services/dataDB.js";
// import { notification } from "../services/notificationService.js";
// import { loadContact } from "../services/dataService.js";

export async function setupContactEvents() {
  const contactsData = await getContactsData();
  modalData.contactsData = contactsData;
  listContact(contactsData);

  // 여기에서 연락처 관련 이벤트 핸들러를 설정합니다.
  document
    .getElementById("export_button")
    .addEventListener("click", handleExportToExcel);

  // formDataCallback 설정
  setFormDataCallback((formData) => {
    const selectElement = document.getElementById("contact_group_select");

    if (selectElement) {
      const elementSelect = selectElement.shadowRoot.querySelector("select");
      if (selectElement && elementSelect) {
        const selectValue =
          selectElement.shadowRoot.querySelector("select").value;

        // 셀렉트 값이 선택되었는지 확인
        if (selectValue === "" || selectValue === "연락처 그룹 선택") {
          // 셀렉트 값이 선택되지 않았을 때는 데이터를 전달하지 않음
          alert("setFormDataCallback 유효한 연락처 그룹을 선택해주세요.");
          return false; // 성공 여부를 반환하지 않음
        }
      }
    }

  });

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
  }
});


// listContact 함수 내에서 연락처 데이터를 가져와서 DOM에 반영
export async function listContact() {

  // const fetchData = modalData.contactsData;
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
      acc[key] = [];
    }

    acc[key].push(contact);
    return acc;
  }, {});

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
                <app-list-card x-on:click="handleDetailClick; if (modalState !== 'detail') { modalOpen = true; modalState = 'detail'; notification = false; }" id="detail" data-contactData='${contactData}'>
                </app-list-card>
            `;
      // contactItem.innerHTML = `
      //           <app-list-card x-on:click="if (modalState !== 'detail') { modalOpen = true; modalState = 'detail'; notification = false; }" id="detail" data-contactId="${contact.contact_id}" data-contactGroup="${contact.contact_group}" data-fullName="${contact.full_name}" data-position="${contact.position}" data-rank="${contact.rank}" 
      //           data-teamName="${contact.team_name}" data-status="${contact.status}" data-photoUrl="${contact.photo_url}" data-divisionName="${contact.division_name}"
      //           data-personalNumber="${contact.personal_phone_number}" data-officeNumner="${contact.office_phone_number}" data-extensionNumber="${contact.extension_number}" data-emailAddress="${contact.email_address}">
      //           </app-list-card>
      //       `;
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
}