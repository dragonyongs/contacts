import { getDataDB } from "../services/dataDB.js";
import { getContactsData, loadContact } from "../services/dataService.js";
import { triggerContactUpdateEvent } from "../eventHandlers/contactEvents.js";
import { notification } from "../services/notificationService.js";

// 연락처 삭제 함수
export async function deleteContact(contactId) {
  const database = await getDataDB();
  try {
    if (contactId) {
      // 삭ㅔ 대상 연락처 로드
      const deleteContact = await loadContact(contactId);
      // 삭제 전 확인 대화상자 표시
      const isConfirmed = confirm("정말로 연락처를 삭제하시겠습니까?");

      if (isConfirmed) {
        const contactsData = await getContactsData();
        await database.contacts.delete(Number(contactId));
        triggerContactUpdateEvent(contactsData); // 커스텀 이벤트 발생시키기
        notification(`${deleteContact.full_name}님의 연락처를 삭제했습니다.`);

      } else {
        notification(`${deleteContact.full_name}님의 연락처 삭제가 취소되었습니다.`);
      }
    }
  } catch (error) {
    notification("연락처 삭제에 실패했습니다: " + error);
    console.log(error);
  }
}

window.deleteContact = deleteContact;
