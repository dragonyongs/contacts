import { getDataDB } from "../services/dataDB.js";
import { triggerContactUpdateEvent } from "../eventHandlers/contactEvents.js";

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
