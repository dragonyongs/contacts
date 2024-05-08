import { getDataDB } from "./dataDB.js";

// 포함된 부분 검색
export async function searchDatabase(searchText) {
    const database = await getDataDB();
    return database.contacts
        .filter(contact =>
            contact.full_name.toLowerCase().includes(searchText.toLowerCase()) ||
            contact.personal_phone_number.toLowerCase().includes(searchText.toLowerCase()) ||
            contact.team_name.toLowerCase().includes(searchText.toLowerCase())
        )
        .toArray();
}

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
