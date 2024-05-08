import { getDataDB } from "./dataDB.js";
import { triggerContactUpdateEvent } from "../eventHandlers/contactEvents.js";


let databaseInstance = null;

export async function getDatabase() {
  if (!databaseInstance) {
    databaseInstance = await getDataDB();
  }
  return databaseInstance;
}

export async function getContactsData() {
  try {
    const database = await getDataDB();
    const contacts = await database.contacts.toArray();
    console.log('getContactsData-length: ', contacts.length);

    return contacts;
  } catch (error) {
    console.error("Failed to retrieve contacts data: ", error);
    return [];
  }
}

export async function getContactGroups() {
  try {
    const database = await getDataDB();
    const contacts = await database.contacts.toArray();
    const groups = new Set(contacts.map((contact) => contact.contact_group));
    return Array.from(groups);
  } catch (error) {
    console.error("Failed to retrieve contact groups: ", error);
    return [];
  }
}

export async function getContactAll() {
  try {
    const contacts = await database.contacts.toArray();
    return Array.from(contacts);
  } catch (error) {
    console.error("Failed to retrieve contacts data: ", error);
    return [];
  }
}

export async function loadContact(id) {
  const contactId = Number(id);
  const result = await database.contacts.get(contactId);
  return result;
}

export async function updateContact(id, newData) {
  const contactId = Number(id);
  await database.contacts.update(contactId, newData);
}

// 새로운 연락처 추가 함수
export async function addContactToIndexedDB(formData) {
  try {
    // 폼 데이터를 객체로 변환
    const contact = {};
    for (const [key, value] of formData.entries()) {
      contact[key] = value;
    }

    // 데이터베이스에 연락처 추가
    await database.contacts.add(contact);
    triggerContactUpdateEvent(contact);
    console.log("New contact added to IndexedDB:", contact);
    return true;
  } catch (error) {
    console.error("Error adding contact to IndexedDB:", error);
    return false;
  }
}

// 기존 연락처 업데이트 함수
export async function updateContactInIndexedDB(event, formData) {
  try {
    // 폼 데이터를 객체로 변환
    const contact = {};
    for (const [key, value] of formData.entries()) {
      contact[key] = value;
    }

    // 데이터베이스에서 기존 연락처 찾아 업데이트
    const id = Number(event.target.id);
    // console.log('updateContactInIndexedDB---contact', contact);

    delete contact.id; // id는 수정할 필드가 아니므로 삭제
    await database.contacts.update(id, contact);
    triggerContactUpdateEvent(contact);
    console.log("Contact updated in IndexedDB:", contact);
    return true;
  } catch (error) {
    console.error("Error updating contact in IndexedDB:", error);
    return false;
  }
}