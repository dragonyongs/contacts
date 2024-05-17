import { resetDetailContent } from "../../eventHandlers/modalEvents.js";
import { loadContact, addContactToIndexedDB, updateContactInIndexedDB } from "../../services/dataService.js";
import { notification } from "../../services/notificationService.js";

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
    await this.processForm(event, formData, true);
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
      await this.processForm(event, formData, false);
      
    } else {
      console.error("Failed to load data to update.");
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
    if (selectElement) {
      const selectValue =
        selectElement.shadowRoot.querySelector("select").value;

      if (selectElement.required && !selectValue) {
        selectElement.classList.add("required");
        return false; // 유효성 검사 실패
      }

      selectElement.classList.remove("required");
      return selectValue; // 유효성 검사 통과한 값 반환
    }
  }

  // processForm 함수 수정
  async processForm(event, formData, isNew) {
    event.preventDefault();

    let selectValid = true;
    let requiredInputsFilled = true;

    const selectElement = document.querySelector("#contact_group_select");

    if (selectElement) {
      const elementSelect = selectElement.shadowRoot.querySelector("select");

      const selectValue = this.validateSelect(selectElement);
      formData.append("contact_group", elementSelect.value);
      if (!selectValue) {
        selectValid = false;
      }

    }

    const modalInputs = document.querySelector("#addEdit").querySelectorAll("app-modal-input");

    modalInputs.forEach((modalInput) => {
      const inputElement = modalInput.shadowRoot.querySelector("input");
      const inputName = inputElement.getAttribute("name");
      const validatedValue = this.validateInput(inputElement);

      if (requiredInputsFilled) {
        formData.append(inputName, validatedValue);
      } else {
        requiredInputsFilled = false;
      }
      
    });
    
    if (!selectValid || !requiredInputsFilled) {
      if (!selectValid) {
        notification("유효한 연락처 그룹을 선택해주세요.");
      }

      if (!requiredInputsFilled) {
        notification("필수 입력값을 채워주세요.");
      }
      return false;
    }

    // isNew 값에 따라 등록 또는 수정 동작 수행
    if (isNew) {
      // 새 데이터 추가
      await addContactToIndexedDB(formData);
    } else {
      // 기존 데이터 수정
      await updateContactInIndexedDB(event, formData);
    }
    
    // 처리 후에는 모달을 초기화
    this.resetModal();
  }

  resetModal() {
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