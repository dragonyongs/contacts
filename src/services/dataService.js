import { getDataDB } from "./dataDB.js";

let databaseInstance = null;

export async function getDatabase() {
  if (!databaseInstance) {
    databaseInstance = await getDataDB();
  }
  return databaseInstance;
}

export async function getContactsData() {
  const database = await getDatabase();
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
