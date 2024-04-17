import { getDataDB } from "../services//dataDB.js";

let databaseInstance = null;

export async function getDatabase() {
    if (!databaseInstance) {
        databaseInstance = await getDataDB();
    }
    return databaseInstance;
}

export async function deleteContactById(contact_id) {
    const database = await getDatabase();
    try {
        await database.contacts.delete(Number(contact_id));
        const deleteEvent = new CustomEvent("deleteContact", { detail: { contact_id: contact_id } });
        document.dispatchEvent(deleteEvent); // 이벤트를 발생시킴
        console.log(`Contact with ID ${contact_id} deleted successfully.`);
    } catch (error) {
        console.error(`Failed to delete contact with ID ${contact_id}: `, error);
    }
}


console.log("modalDetailhandler.js Loaded!");

  // 전역 스코프에서 접근 가능하게 하기 위해 window 객체에 할당
window.deleteContactById = deleteContactById;