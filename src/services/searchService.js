import { getContactsData } from "../services/dataService.js";

function normalizePhoneNumber(phoneNumber) {
    if (typeof phoneNumber !== 'string') {
        return ''; // 전화번호가 문자열이 아닌 경우 빈 문자열 반환
    }
    return phoneNumber.replace(/[^\d]/g, ''); // 숫자 이외의 문자 제거
}

function searchInContact(contact, searchTerms) {
    const contact_group = contact.contact_group.toLowerCase();
    const fullName = contact.full_name.toLowerCase();
    const teamName = contact.team_name.toLowerCase();
    const status = contact.status.toLowerCase();
    const phoneNumber = normalizePhoneNumber(contact.personal_phone_number);
    
    return searchTerms.some(term => 
        contact_group.includes(term) ||
        fullName.includes(term) ||
        teamName.includes(term) ||
        status.includes(term) ||
        phoneNumber.includes(term)
    );
}

export async function searchDatabase(searchText) {
    const contactsData = await getContactsData();
    const searchTerms = searchText.toLowerCase().split(' ').map(term => term.trim());
    
    return contactsData.filter(contact => searchInContact(contact, searchTerms));
}
