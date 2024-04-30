import { getDataDB } from "./dataDB.js";

let databaseInstance = null;
const database = await getDataDB();

export async function getDatabase() {
  if (!databaseInstance) {
    databaseInstance = await getDataDB();
  }
  return databaseInstance;
}

export async function getContactsData() {
  try {
    const contacts = await database.contacts.toArray();
    return contacts;
  } catch (error) {
    console.error("Failed to retrieve contacts data: ", error);
    return [];
  }
}

export async function getContactGroups() {
  try {
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