import { getDataDB } from "./dataDB.js";
import { getContactsData } from "../services/dataService.js";

// 포함된 부분 검색
// export async function searchDatabase(searchText) {
//     const contactsData = await getContactsData();
//     // console.log('contactsData', contactsData);
//     return contactsData
//         .filter(contact =>
//             contact.full_name.toLowerCase().includes(searchText.toLowerCase()) ||
//             contact.team_name.toLowerCase().includes(searchText.toLowerCase()) ||
//             contact.status.toLowerCase().includes(searchText.toLowerCase()) ||
//             contact.personal_phone_number.toLowerCase().includes(searchText.toLowerCase())
//         );
// }

export async function searchDatabase(searchText) {
    const contactsData = await getContactsData();
    return contactsData.filter(contact => {
        const contact_group = contact.contact_group.toLowerCase();
        const fullName = contact.full_name.toLowerCase();
        const teamName = contact.team_name.toLowerCase();
        const status = contact.status.toLowerCase();
        const phoneNumber = typeof contact.personal_phone_number === 'number' ? contact.personal_phone_number.toString() : '';
        
        return  contact_group.includes(searchText.toLowerCase()) ||
                fullName.includes(searchText.toLowerCase()) ||
                teamName.includes(searchText.toLowerCase()) ||
                status.includes(searchText.toLowerCase()) ||
                phoneNumber.includes(searchText.toLowerCase());
    });
}


// export async function searchDatabase(searchText) {
//     const database = await getDataDB();
//     return database.contacts
//         .filter(contact =>
//             contact.full_name.toLowerCase().includes(searchText.toLowerCase()) ||
//             contact.personal_phone_number.toLowerCase().includes(searchText.toLowerCase()) ||
//             contact.team_name.toLowerCase().includes(searchText.toLowerCase()) ||
//             contact.status.toLowerCase().includes(searchText.toLowerCase())
//         )
//         .toArray();
// }

// 쿼리로만 검색
// export async function searchDatabase(searchText) {
//     const database = await getDataDB();
//     return database.contacts
//         .where('full_name') // 첫 번째 컬럼
//         .startsWithIgnoreCase(searchText)
//         .or('personal_phone_number') // 두 번째 컬럼
//         .startsWithIgnoreCase(searchText)
//         .or('team_name') // 세 번째 컬럼
//         .startsWithIgnoreCase(searchText)
//         .toArray();
// }
