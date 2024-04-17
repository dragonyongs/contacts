import { getContactsData } from "../services/dataService.js";
import { exportContactsToExcel } from "../services/excelService.js";
import { getDataDB } from "../services/dataDB.js";

// 연락처 목록을 엑셀 파일로 내보내기
async function handleExportToExcel() {
  const contacts = await getContactsData();
  exportContactsToExcel(contacts);
}

export function setupContactEvents() {
  // 여기에서 연락처 관련 이벤트 핸들러를 설정합니다.
  document
    .getElementById("export_button")
    .addEventListener("click", handleExportToExcel);
}

// 커스텀 이벤트 생성 및 발생시키기
export function triggerContactUpdateEvent(updatedContacts) {
  const event = new CustomEvent("contactUpdate", {
    detail: { updatedContacts, open: false },
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
      "z-10 sticky -top-[1px] px-3 py-2 border-t-0 border-b border-l-0 border-r-0 border-gray-200 bg-white";
    const memberCount = groupedGroup[contact_group].length; // 그룹 내 데이터 수 계산
    groupTitle.innerHTML = `<p class="text-sm font-semibold">${contact_group}</p> <div class="absolute top-1/2 -translate-y-1/2 right-4 text-sm tracking-tight text-blue-600">${memberCount}명</div>`;
    contactList.appendChild(groupTitle);

    // group 속한 사용자 목록 생성
    const groupList = document.createElement("ul");
    groupedGroup[contact_group].forEach((contact) => {
      const contactItem = document.createElement("li");
      contactItem.innerHTML = `
                <app-list-card data-contactId="${contact.contact_id}" data-fullName="${contact.full_name}" data-position="${contact.position}" data-rank="${contact.rank}" 
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
      "flex justify-center items-center w-full h-full bg-slate-50";
    emptyMessageWrap.innerHTML = `<p class="font-semibold text-2xl">연락처를 등록해주세요.</p>`;
    contactList.appendChild(emptyMessageWrap);
  } else if (contacts.length > 0) {
    document.getElementById("contact-list").classList.remove("h-full");
  }
}

// contactEvents.js

// 연락처 저장 이벤트 리스너
document.addEventListener("saveContact", async (e) => {
  const database = await getDataDB();

  const formData = e.detail;
  const plainObject = {};

  // FormData를 일반 객체로 변환
  for (let [key, value] of formData.entries()) {
    plainObject[key] = value;
  }

  // 비어 있는 항목 제거
  const cleanedObject = Object.entries(plainObject).reduce(
    (acc, [key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    },
    {}
  );

  try {
    // 데이터베이스에 연락처 추가
    await database.contacts.add(cleanedObject);
    alert("연락처가 성공적으로 추가되었습니다!");
    document.getElementById("contact-form").reset();

    // 연락처 데이터가 업데이트되었을 때 (예: 새 연락처 추가 후)
    triggerContactUpdateEvent(cleanedObject); // 커스텀 이벤트 발생시키기
  } catch (error) {
    alert("사용자 추가에 실패했습니다: " + error);
  }
});

// 새로운 연락처를 저장하는 함수
export async function saveContact(formData) {
  const event = new CustomEvent("saveContact", { detail: formData });
  document.dispatchEvent(event);
}

// 연락처 삭제 함수
export async function deleteContact(contactId) {
  const database = await getDataDB();
  try {
    if (contactId) {
      // 삭제 전 확인 대화상자 표시
      const isConfirmed = confirm("정말로 연락처를 삭제하시겠습니까?");

      if (isConfirmed) {
        await database.contacts.delete(Number(contactId));
        alert("연락처가 성공적으로 삭제되었습니다!");
        triggerContactUpdateEvent(); // 커스텀 이벤트 발생시키기
      } else {
        // 사용자가 취소를 선택한 경우
        console.log("연락처 삭제가 취소되었습니다.");
      }
    }
  } catch (error) {
    alert("연락처 삭제에 실패했습니다: " + error);
    console.log(error);
  }
}

window.deleteContact = deleteContact;
// window.dispatchEvent(
//   new CustomEvent("close-modal", { detail: { modalOpen: false } })
// );

// 연락처 삭제 이벤트 리스너
document.addEventListener("deleteContact", async () => {
  await listContact(); // 연락처 목록을 새로 로드하고 DOM에 반영하는 함수
});

window.onload = async function () {
  await listContact();
};
