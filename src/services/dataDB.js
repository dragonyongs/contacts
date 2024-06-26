// dataDB.js
export async function getDataDB() {
    return new Promise((resolve, reject) => {
        // 데이터베이스 초기화
        const db = new Dexie("ContactDatabase");

        db.version(1).stores({
            contacts: `
                ++contact_id,
                contact_group,
                full_name,
                division_name,
                team_name,
                position,
                rank,
                personal_phone_number,
                office_personal_phone_number,
                office_personal_phone_number2,
                office_phone_number,
                office_phone_number2,
                extension_number,
                email_address,
                photo_url,
                status,
                work_place,
                introducer,
                joining_date,
                remarks
            `,
        });

        resolve(db);
    });
}