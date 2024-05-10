import { getDataDB } from "./dataDB.js";
import { triggerContactUpdateEvent } from "../eventHandlers/contactEvents.js";
import { notification } from "../services/notificationService.js";

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
    const database = await getDataDB();
    const contacts = await database.contacts.toArray();
    return Array.from(contacts);
  } catch (error) {
    console.error("Failed to retrieve contacts data: ", error);
    return [];
  }
}

export async function loadContact(id) {
  try {
    const database = await getDataDB();
    const contactId = Number(id);
    const result = await database.contacts.get(contactId);
    return result;
  } catch (error) {
    console.error("Failed to load contact: ", error);
    return null;
  }
}

export async function updateContact(id, newData) {
  try {
    const database = await getDataDB();
    const contactId = Number(id);
    await database.contacts.update(contactId, newData);
    return true;
  } catch (error) {
    console.error("Failed to update contact: ", error);
    return false;
  }
}

export async function addContactToIndexedDB(formData) {
  try {
    const database = await getDataDB();
    const contact = Object.fromEntries(formData.entries());
    await database.contacts.add(contact);
    // triggerContactUpdateEvent(contact, "연락처 등록 완료!");
    console.log("New contact added to IndexedDB:", contact);
    triggerContactUpdateEvent();
    return true;
  } catch (error) {
    console.error("Error adding contact to IndexedDB:", error);
    return false;
  }
}

export async function updateContactInIndexedDB(event, formData) {
  try {
    const database = await getDataDB();
    const contact = Object.fromEntries(formData.entries());
    const id = Number(event.target.id);
    delete contact.id;
    await database.contacts.update(id, contact);
    console.log("Contact updated in IndexedDB:", contact);
    triggerContactUpdateEvent();
    return true;
  } catch (error) {
    console.error("Error updating contact in IndexedDB:", error);
    return false;
  }
}