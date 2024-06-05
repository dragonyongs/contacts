import { resetDetailContent } from "../../eventHandlers/modalEvents.js";
import { loadContact, addContactToIndexedDB, updateContactInIndexedDB } from "../../services/dataService.js";
import { notification } from "../../services/notificationService.js";

const icons = {
  'import-outline': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="upload"><path d="M8.71,7.71,11,5.41V15a1,1,0,0,0,2,0V5.41l2.29,2.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42l-4-4a1,1,0,0,0-.33-.21,1,1,0,0,0-.76,0,1,1,0,0,0-.33.21l-4,4A1,1,0,1,0,8.71,7.71ZM21,14a1,1,0,0,0-1,1v4a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V15a1,1,0,0,0-2,0v4a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V15A1,1,0,0,0,21,14Z"></path></svg>`,
  'export-outline': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="download"><path d="M21,14a1,1,0,0,0-1,1v4a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V15a1,1,0,0,0-2,0v4a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V15A1,1,0,0,0,21,14Zm-9.71,1.71a1,1,0,0,0,.33.21.94.94,0,0,0,.76,0,1,1,0,0,0,.33-.21l4-4a1,1,0,0,0-1.42-1.42L13,12.59V3a1,1,0,0,0-2,0v9.59l-2.29-2.3a1,1,0,1,0-1.42,1.42Z"></path></svg>`,
  'save-outline': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="save"><path d="m20.71 9.29-6-6a1 1 0 0 0-.32-.21A1.09 1.09 0 0 0 14 3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-8a1 1 0 0 0-.29-.71ZM9 5h4v2H9Zm6 14H9v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1Zm4-1a1 1 0 0 1-1 1h-1v-3a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3v3H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6.41l4 4Z"></path></svg>`,
  'more-outline': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="expand-more"><path fill="none" d="M24 24H0V0h24v24z" opacity=".87"></path><path d="M15.88 9.29L12 13.17 8.12 9.29c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41-.39-.38-1.03-.39-1.42 0z"></path></svg>`,
  'close-outline': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="close"><path d="M13.41,12l6.3-6.29a1,1,0,1,0-1.42-1.42L12,10.59,5.71,4.29A1,1,0,0,0,4.29,5.71L10.59,12l-6.3,6.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l6.29,6.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"></path></svg>`,
  'check-outline': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" id="check"><rect width="256" height="256" fill="none"></rect><polyline fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="24" points="216 72.005 104 184 48 128.005"></polyline></svg>`,
  'arrow-right-outline': `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="20" id="arrow"><path fill-rule="evenodd" d="M.366 19.708c.405.39 1.06.39 1.464 0l8.563-8.264a1.95 1.95 0 0 0 0-2.827L1.768.292A1.063 1.063 0 0 0 .314.282a.976.976 0 0 0-.011 1.425l7.894 7.617a.975.975 0 0 1 0 1.414L.366 18.295a.974.974 0 0 0 0 1.413"></path></svg>`,
  'trash-outline': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="trash"><path d="M10,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,10,18ZM20,6H16V5a3,3,0,0,0-3-3H11A3,3,0,0,0,8,5V6H4A1,1,0,0,0,4,8H5V19a3,3,0,0,0,3,3h8a3,3,0,0,0,3-3V8h1a1,1,0,0,0,0-2ZM10,5a1,1,0,0,1,1-1h2a1,1,0,0,1,1,1V6H10Zm7,14a1,1,0,0,1-1,1H8a1,1,0,0,1-1-1V8H17Zm-3-1a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,14,18Z"></path></svg>`,
  'write-outline': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="edit"><path d="M5,18H9.24a1,1,0,0,0,.71-.29l6.92-6.93h0L19.71,8a1,1,0,0,0,0-1.42L15.47,2.29a1,1,0,0,0-1.42,0L11.23,5.12h0L4.29,12.05a1,1,0,0,0-.29.71V17A1,1,0,0,0,5,18ZM14.76,4.41l2.83,2.83L16.17,8.66,13.34,5.83ZM6,13.17l5.93-5.93,2.83,2.83L8.83,16H6ZM21,20H3a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2Z"></path></svg>`,
  'reset-outline': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 4.233 4.233" id="delete-file"><g transform="translate(73.405 -1.965)"><g><g><g><g><g><g><g transform="translate(.065)"><path fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".265" d="m -70.066659,3.8038327 c -0.02334,-0.118977 -0.08491,-0.2028207 -0.182598,-0.31317 l -0.912657,-0.9126578 c -0.178383,-0.1802742 -0.249987,-0.2175578 -0.498678,-0.2175578 h -0.776696 c -0.293159,0 -0.529167,0.2360083 -0.529167,0.5291666 V 5.272414 c 0,0.2931583 0.236008,0.5291666 0.529167,0.5291666 h 1.45452" paint-order="markers fill stroke" transform="translate(.11)"></path><path fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".265" d="m -71.511769,2.4937722 v 0.794267 c 0,0.293158 0.236008,0.529167 0.529167,0.529167 h 0.917044" paint-order="markers fill stroke" transform="translate(.11)"></path><path stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".265" d="M-70.589398 4.6455183l.628504.6285034M-69.960894 4.6455183l-.628504.6285034" paint-order="markers fill stroke" transform="translate(.11)"></path><path stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".265" d="M-72.242246 4.899559h.818512M-72.242246 4.215516h.491107" paint-order="markers fill stroke"></path></g></g></g></g></g></g></g></g></svg>`,
}

let formDataCallback;

export function setFormDataCallback(callback) {
  formDataCallback = callback;
}

export class AppButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.addEventListeners();
  }

  addEventListeners() {
    this.addEventListener("click", this.handleClick.bind(this));
  }

  getAttributeOrEmpty(attr) {
    return this.getAttribute(attr) || "";
  }

  get id() {
    return this.getAttribute("id") || "";
  }

  get for() {
    return this.getAttribute("for") || "";
  }
  get type() {
    return this.getAttribute("type") || "button";
  }

  get role() {
    return this.getAttribute("role") || "button";
  }

  get class() {
    return this.getAttribute("class") || "";
  }

  get iconName() {
    return this.getAttribute("data-iconName") || "";
  }

  get iconSize() {
    return this.getAttribute("data-iconSize") || "small";
  }

  get method() {
    return this.getAttribute("data-method") || "";
  }

  template(state) {
    return `
            <link rel="stylesheet" href="./src/components/Button/app-button.css">
            <button type="${state.type}" role="${state.role}" ${
      state.id ? `id="${state.id}"` : ""
    } class="${state.class}">
                ${
                  state.iconName && state.iconSize
                    ? `<ion-icon name="${state.iconName}" size="${state.iconSize}"></ion-icon>`
                    : ""
                }
                <label for="${state.for}"><slot name="label"></slot></label>
            </button>
        `;
  }

  connectedCallback() {
    this.render();

    // 'remove-overflow' 클래스가 버튼에 추가되어 있는 경우에만 처리
    if (this.classList.contains("remove-overflow")) {
      this.addEventListener("click", () => {
        // 모달 내의 요소들을 초기화하는 함수 호출
        resetDetailContent();

        const isActive = document.body.classList.contains("active");

        // 'active' 클래스가 있으면 제거합니다.
        if (isActive) {
          document.body.classList.remove("active");
        }

        // 'overflow-hidden' 클래스를 제거합니다.
        document.body.classList.remove("overflow-hidden");
      });
    }
  }

  render() {
    this.shadowRoot.innerHTML = this.template({
      id: this.id,
      type: this.type,
      for: this.for,
      class: this.class,
      role: this.role,
      iconName: this.iconName,
      iconSize: this.iconSize,
      method: this.method,
    });
  }


  // 유효성 검사 함수
  validateInput(inputElement) {
    const inputValue = inputElement.value.trim();
    if (inputElement.required && !inputValue) {
      inputElement.classList.add("required");
      return false; // 유효성 검사 실패
    }
    inputElement.classList.remove("required");
    return inputValue; // 유효성 검사 통과한 값 반환
  }

  validateSelect(selectElement) {
    console.log('selectElement', selectElement);
    if (selectElement) {
      const selectValue = selectElement.value;
      if (selectElement.required && !selectValue) {
        selectElement.classList.add("required");
        return false; // 유효성 검사 실패
      }
      selectElement.classList.remove("required");
      return selectValue; // 유효성 검사 통과한 값 반환
    }
    return false; // selectElement가 없는 경우
  }

  async processForm(event, formData, isNew) {
    event.preventDefault();
  
    let selectValid = true;
    let requiredInputsFilled = true;
  
    const appSelectElement = document.querySelector("#contact_group_select");
    if (appSelectElement) {
      const selectElement = appSelectElement.shadowRoot.querySelector("select");
      if (selectElement) {
        const selectValue = this.validateSelect(selectElement);
        if (selectValue) {
          formData.append("contact_group", selectValue);
        } else {
          selectValid = false;
        }
      }
    }
  
    const modalInputs = document.querySelector("#addEdit").querySelectorAll("app-modal-input");
  
    modalInputs.forEach((modalInput) => {
      const inputElement = modalInput.shadowRoot.querySelector("input");
      const inputName = inputElement.getAttribute("name");
      const validatedValue = this.validateInput(inputElement);
  
      if (validatedValue === false) {
        requiredInputsFilled = false;
      } else {
        formData.append(inputName, validatedValue);
      }
    });
  
    if (!selectValid || !requiredInputsFilled) {
      window.dispatchEvent(
        new CustomEvent("notification-modal", { detail: { notification: true } })
      );
      if (!selectValid) {
        notification("유효한 연락처 그룹을 선택해주세요.");
      }
      if (!requiredInputsFilled) {
        notification("필수 입력값을 채워주세요.");
      }
      return false; // 유효성 검사 실패 시 처리 중단
    }
  
    // isNew 값에 따라 등록 또는 수정 동작 수행
    if (isNew) {
      // 새 데이터 추가
      await addContactToIndexedDB(formData);
    } else {
      // 기존 데이터 수정
      await updateContactInIndexedDB(event, formData);
    }
  
    return true; // 성공적으로 처리된 경우 true 반환
  }

  async handleClick(event) {
    event.stopPropagation(); // Stop event bubbling
    const target = event.target;
    // const appButton = target.closest("app-button");

    if (target.matches('app-button[type="submit"]')) {
      const method = target.getAttribute("data-method");
      
      if (method === "post") {
        this.handleSaveButtonClick(event);
      } else if (method === "put") {
        this.handleUpdateButtonClick(event);
      }
    }
  }

  // 등록 버튼 클릭 이벤트 핸들러
  async handleSaveButtonClick(event) {
    const formData = new FormData();
    const isFormProcessed = await this.processForm(event, formData, true);
    if (isFormProcessed) {
      console.log('handleSaveButtonClick isFormProcessed로 resetModal() 함수 실행');
      this.resetModal();
      window.dispatchEvent(
        new CustomEvent("close-modal", { detail: { modalOpen: false } })
      );
      window.dispatchEvent(
        new CustomEvent("notification-modal", { detail: { notification: true } })
      );
    }
  }

  // 수정 버튼 클릭 이벤트 핸들러
  async handleUpdateButtonClick(event) {
    const formData = new FormData();
    const idToUpdate = Number(event.target.id);
    const dataToUpdate = await loadContact(idToUpdate);
    if (dataToUpdate) {
      console.log("Loaded data to update:", dataToUpdate);
  
      // 폼 내의 인풋 요소들에 접근하여 값을 FormData에 추가
      const form = event.target.closest('form');
      if (form) {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
          formData.append(input.name, input.value);
        });

      } else {
        console.error("Form not found.");
      }

      // FormData를 처리하는 메서드 호출
      const isFormProcessed = await this.processForm(event, formData, false);
      if (isFormProcessed) {
        console.log('handleUpdateButtonClick isFormProcessed로 resetModal() 함수 실행');
        this.resetModal();
        window.dispatchEvent(
          new CustomEvent("close-modal", { detail: { modalOpen: false} })
        );
        window.dispatchEvent(
          new CustomEvent("notification-modal", { detail: { notification: true } })
        );
      }

    } else {
      console.error("Failed to load data to update.");
    }
  }


  resetModal() {
    console.log('resetModal 실행!');

    // 입력 필드 초기화
    const modalInputs = document.querySelectorAll("app-modal-input");


    modalInputs.forEach((modalInput) => {
      const inputElement = modalInput.shadowRoot.querySelector("input");
      inputElement.value = "";
    });

    document.body.classList.remove("overflow-hidden");
    document.body.classList.remove("active");
  }
}

customElements.define("app-button", AppButton);

document.addEventListener("click", (event) => {
  const target = event.target;
  if (target.matches('app-button[type="submit"]')) {
    const appButton = target.closest("app-button");
    if (appButton) {
      appButton.handleClick(event);
    }
  }
});