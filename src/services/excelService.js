import { getContactsData } from "../services/dataService.js";
import { listContact, triggerContactUpdateEvent } from "../eventHandlers/contactEvents.js";
import { notification } from "../services/notificationService.js";

let globalJsonData = null;
const resetButton = document.getElementById("reset_button");
const exportButton = document.getElementById("export_button");
const importButton = document.getElementById("import_button");
const applyButton = document.getElementById("apply_button");

export async function setupExcelService(database) {
  const contactsData = await getContactsData();
  const contactsCount = contactsData.length;
  
  const importFileInput = document.getElementById("import_file").shadowRoot.querySelector("input");


  if (contactsCount === 0) {
    resetButton.classList.add('hidden');
    exportButton.classList.add('hidden');  
  }

  importButton.addEventListener("click", () => importFileInput.click());
  exportButton.addEventListener("click", () => handleExportToExcel());
  importFileInput.addEventListener("change", (e) => handleImportFromExcel(e, database));
  applyButton.addEventListener("click", () => handleApply(database));
  resetButton.addEventListener("click", () => handleResetData(contactsData, database));
}

async function handleResetData(contactsData, database) {
  const isConfirmed = confirm("정말로 데이터를 초기화 하시겠습니까?");

  if (isConfirmed) {
    await database.contacts.clear()
    triggerContactUpdateEvent(contactsData); // 커스텀 이벤트 발생시키기
    notification(`데이터 초기화를 완료했습니다.`);

    resetButton.classList.add('hidden');
    exportButton.classList.add('hidden');
    
  } else {
    notification(`데이터 초기화를 취소되었습니다.`);
  }
  
}

export async function importContactsFromExcel() {
  try {
    const fileInput = document.getElementById("import_file").shadowRoot.querySelector("input");

    let file = fileInput.files[0];
    var reader = new FileReader();
    reader.onload = async function (e) {
      console.log("File upload changed!");
      // 불러오기 버튼 숨기기
      importButton.classList.add("hidden");
      // 적용하기 버튼 표시
      applyButton.classList.remove("hidden");

      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, { type: "array" });
      var firstSheetName = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[firstSheetName];
      var jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      // 한국어 헤더를 영어 키로 매핑하고 데이터를 변환
      globalJsonData = mapHeadersFromKoreanToEnglish(jsonData);
    };
    reader.readAsArrayBuffer(file);
  } catch (error) {
    console.error("Failed to import contacts from Excel: ", error);
    notification("엑셀 파일을 가져오는 중에 오류가 발생했습니다.");
  }
}

async function handleImportFromExcel(e, database) {
  try {
    // 엑셀 파일에서 데이터 읽기 및 데이터베이스에 적용
    await importContactsFromExcel(e, database);
  } catch (error) {
    console.error("Failed to import contacts from Excel: ", error);
    notification("엑셀 파일을 가져오는 중에 오류가 발생했습니다.");
  }
}

function mapHeadersFromKoreanToEnglish(jsonData) {
  const fieldMappingReverse = {
    "연락처 그룹": "contact_group",
    "전체 이름": "full_name",
    "휴대폰 번호": "personal_phone_number",
    "업무폰 번호": "office_personal_phone_number",
    "업무폰 번호2": "office_personal_phone_number2",
    "회사 전화": "office_phone_number",
    "회사 전화2": "office_phone_number2",
    "내선 번호": "extension_number",
    "이메일 주소": "email_address",
    "직급 명칭": "rank",
    "직책 명칭": "position",
    "소속 부서": "division_name",
    "팀 이름": "team_name",
    "현재 상태": "status",
    "사진 URL": "photo_url",
    "근무지": "work_place",
    "도입자": "introducer",
    "입사일": "joining_date",
    "비고": "remarks",
  };
  
  return jsonData.map((row) => {
      return Object.keys(row).reduce((acc, key) => {
          const englishKey = fieldMappingReverse[key] || key;
          acc[englishKey] = row[key];
          return acc;
      }, {});
  });
}

export async function exportContactsToExcel() {

  console.log('exportContactsToExcel');

  const contacts = await getContactsData();

  const fieldMapping = {
    contact_group: "연락처 그룹",
    full_name: "전체 이름",
    personal_phone_number: "휴대폰 번호",
    office_personal_phone_number: "업무폰 번호",
    office_personal_phone_number: "업무폰 번호2",
    office_phone_number: "회사 전화",
    office_phone_number2: "회사 전화2",
    extension_number: "내선 번호",
    email_address: "이메일 주소",
    rank: "직급 명칭",
    position: "직책 명칭",
    division_name: "소속 부서",
    team_name: "팀 이름",
    status: "현재 상태",
    photo_url: "사진 URL",
    work_place: "근무지",
    introducer: "도입자",
    joining_date: "입사일",
    remarks: "비고",
  };

  // 명시적인 헤더 순서 정의
  const headers = [
    "contact_group",
    "full_name",
    "personal_phone_number",
    "office_personal_phone_number",
    "office_personal_phone_number2",
    "office_phone_number",
    "office_phone_number2",
    "extension_number",
    "email_address",
    "rank",
    "position",
    "division_name",
    "team_name",
    "status",
    "photo_url",
    "work_place",
    "introducer",
    "joining_date",
    "remarks",
  ];

  // 헤더를 한국어로 변환하고 정의된 순서대로 데이터를 정렬
  const koreanHeadersData = await contacts.map((contact) => {
    return headers.reduce((acc, key) => {
      acc[fieldMapping[key] || key] = contact[key];
      return acc;
    }, {});
  });

  // 변환된 데이터로 엑셀 파일 생성
  var worksheet = XLSX.utils.json_to_sheet(koreanHeadersData, {
    header: headers.map((key) => fieldMapping[key] || key),
  });
  var workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");

  // 현재 날짜와 시간을 구하는 함수
  function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${year}${month}${day}(${hours}:${minutes}:${seconds})`;
  }

  // 파일 이름에 현재 날짜와 시간 추가
  const fileName = `contacts-${getCurrentDateTime()}.xlsx`;

  // 엑셀 파일 내보내기
  XLSX.writeFile(workbook, fileName);
}

// 연락처 목록을 엑셀 파일로 내보내기
export async function handleExportToExcel() {
  try {
    // 엑셀 파일 생성 및 내보내기
    exportContactsToExcel();
    console.log('handleExportToExcel');
  } catch (error) {
    console.error("Failed to export contacts to Excel: ", error);
    notification("엑셀 파일을 내보내는 중에 오류가 발생했습니다.");
  }
}

async function handleApply(database) {
  try {
    // 데이터베이스에 업데이트된 데이터 적용
    await applyChangesToDatabase(database);
    // 불러오기 버튼 숨기기
    document.getElementById("import_button").classList.remove("hidden");
    // 적용하기 버튼 표시
    document.getElementById("apply_button").classList.add("hidden");
    document.body.classList.remove("active");
    document.body.classList.remove("overflow-hidden");
  } catch (error) {
    console.error("Failed to apply contacts data: ", error);
    notification("데이터를 적용하는 중에 오류가 발생했습니다.");
  }
}

async function applyChangesToDatabase(database) {
  try {

    if (!database) {
      notification("데이터베이스가 준비되지 않았습니다.");
      return;
    }

    // 데이터베이스에 변경사항 적용
    await database.transaction("rw", database.contacts, async () => {
      await database.contacts.clear(); // 기존 연락처 데이터 삭제
      await database.contacts.bulkAdd(globalJsonData); // 새로운 데이터 추가
      triggerContactUpdateEvent(database.contacts);
      notification("연락처를 불러오기가 완료되었습니다.");
    });

    // 성공 알림
    resetButton.classList.remove('hidden');
    exportButton.classList.remove('hidden');
    resetButton.classList.remove('hidden');

    // 연락처 목록 다시 로드
    await listContact();

    // 외부 컴포넌트에서 이벤트 발생
    window.dispatchEvent(
      new CustomEvent("close-modal", { detail: { open: false } })
    );
  } catch (error) {
    console.error("Failed to apply changes to the database: ", error);
    notification("데이터를 적용하는 중에 오류가 발생했습니다.");
  }
}