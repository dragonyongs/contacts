import { getContactsData } from "../services/dataService.js";
import { handleExportToExcel } from "../services/excelService.js";
import { getDataDB } from "../services/dataDB.js";
import {
  AppButton,
  setFormDataCallback,
} from "../components/Button/app-button.js"; // 변경된 경로

export function setupContactEvents() {
  // 여기에서 연락처 관련 이벤트 핸들러를 설정합니다.
  document
    .getElementById("export_button")
    .addEventListener("click", handleExportToExcel);

  const saveContactButton = document.getElementById("save_contact_button");

  if (!AppButton) {
    const appButton = new AppButton();

    saveContactButton.addEventListener("click", (event) => {
      appButton.submitForm(event); // formDataCallback은 설정하지 않음
    });
  }

  // formDataCallback 설정
  setFormDataCallback((formData) => {
    const selectElement = document.getElementById('contact_group_select').shadowRoot.querySelector('#contact_group_select');
    const selectValue = selectElement.value;

    // 셀렉트 값이 선택되었는지 확인
    if (selectValue === "" || selectValue === "연락처 그룹 선택") {
      // 셀렉트 값이 선택되지 않았을 때는 데이터를 전달하지 않음
      alert("setFormDataCallback 유효한 연락처 그룹을 선택해주세요.");
      return false; // 성공 여부를 반환하지 않음
    }

    // 셀렉트 값이 선택되었을 때만 데이터를 전달하고 성공을 반환
    const success = saveContact(formData); // 폼 제출 시 실행될 함수
    return success;
  });

  window.onload = async function () {
    await listContact();
  };
}

// 커스텀 이벤트 생성 및 발생시키기
export function triggerContactUpdateEvent(updatedContacts) {
  console.log("triggerContactUpdateEvent 실행");
  const event = new CustomEvent("contactUpdate", {
    detail: { updatedContacts },
  });

  window.dispatchEvent(event);
}

// 이벤트 리스너 추가
window.addEventListener("contactUpdate", async (e) => {
  const updatedContacts = e.detail;
  await listContact(updatedContacts); // 연락처 목록을 새로 로드하고 DOM에 반영하는 함수
});

// listContact 함수 내에서 연락처 데이터를 가져와서 DOM에 반영
export async function listContact() {
  const contacts = await getContactsData();
  const contactList = document.getElementById("contact-list");
  contactList.innerHTML = ""; // 기존 목록 초기화

  // 데이터 그룹화
  const groupedGroup = contacts.reduce((acc, contact) => {
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
      contactItem.innerHTML = `
                <app-list-card x-on:click="if (modalState !== 'detail') { modalOpen = true; modalState = 'detail'; }" id="detail" data-contactId="${contact.contact_id}" data-contactGroup="${contact.contact_group}" data-fullName="${contact.full_name}" data-position="${contact.position}" data-rank="${contact.rank}" 
                data-teamName="${contact.team_name}" data-status="${contact.status}" data-photoUrl="${contact.photo_url}" data-divisionName="${contact.division_name}"
                data-personalNumber="${contact.personal_phone_number}" data-officeNumner="${contact.office_phone_number}" data-extensionNumber="${contact.extension_number}" data-emailAddress="${contact.email_address}">
                </app-list-card>
            `;
      groupList.appendChild(contactItem);
    });
    contactList.appendChild(groupList);
  });

  // 데이터가 비어 있을 때 메시지 추가
  if (contacts.length === 0) {
    document.getElementById("contact-list").classList.add("h-full");
    const emptyMessageWrap = document.createElement("div");
    emptyMessageWrap.className =
      "w-full h-full bg-slate-50";
    emptyMessageWrap.innerHTML = `<div class="noData"><p>연락처를 등록해주세요.</p></div>`;
    contactList.appendChild(emptyMessageWrap);
  } else if (contacts.length > 0) {
    document.getElementById("contact-list").classList.remove("h-full");
  }
}

// 연락처 저장 이벤트 리스너
async function saveContact(submittedFormData) {
  const database = await getDataDB();
  const selectElement = document
    .querySelector("#contact_group_select")
    .shadowRoot.querySelector("select");
  const contactGroupElement = document.querySelector("#contact_group_input");

  if (selectElement) {
    submittedFormData.append(selectElement.name, selectElement.value); // 명시적으로 값을 추가
  }

  const keys = [
    "contact_group",
    "full_name",
    "division_name",
    "team_name",
    "position",
    "rank",
    "personal_phone_number",
    "office_phone_number",
    "extension_number",
    "contact_group",
    "photo_url",
    "email_address"
  ];

  keys.forEach(key => {
    const value = submittedFormData.get(key);
    if (!value) {
      submittedFormData.set(key, "");
    }
  });

  const plainObject = {};

  // FormData를 일반 객체로 변환
  for (let [key, value] of submittedFormData.entries()) {
    plainObject[key] = value;
  }

  console.log('plainObject', plainObject);

  try {
    // 데이터베이스에 연락처 추가
    await database.contacts.add(plainObject);

    alert("연락처가 성공적으로 추가되었습니다!");
    document.getElementById("contact-form").reset();

    // 연락처 데이터가 업데이트되었을 때 (예: 새 연락처 추가 후)
    if (
      (selectElement && selectElement.value !== "") ||
      (selectElement && selectElement.value !== "연락처 그룹 선택") ||
      contactGroupElement
    ) {
      triggerContactUpdateEvent(plainObject); // 커스텀 이벤트 발생시키기
    }

    return true; // 폼 제출 성공
  } catch (error) {
    alert("사용자 추가에 실패했습니다: " + error);

    return false; // 폼 제출 실패
  }
}