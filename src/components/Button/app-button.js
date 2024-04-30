import { resetDetailContent } from "../../eventHandlers/modalEvents.js";
import { loadContact } from "../../services/dataService.js";

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
        console.log("close");

        // 모달 내의 요소들을 초기화하는 함수 호출
        resetDetailContent();

        const isActive = document.body.classList.contains("active");

        // 'active' 클래스가 있으면 제거합니다.
        if (isActive) {
          console.log("active 제거");
          document.body.classList.remove("active");
        }

        // 'overflow-hidden' 클래스를 제거합니다.
        document.body.classList.remove("overflow-hidden");
        console.log("overflow-hidden 클래스가 body에서 제거되었습니다.");
      });
    }
  }

  async handleClick(event) {
    event.stopPropagation(); // Stop event bubbling
    const target = event.target;
    const appButton = target.closest("app-button");

    if (target.matches('app-button[type="submit"]')) {
      const method = target.getAttribute("data-method");
      if (method === "post") {
        // appButton.processForm.call(appButton, event); // submitForm 메서드 호출
        this.handleSaveButtonClick(event);
      } else if (method === "put") {
        const loadPerson = await loadContact(event.target.id);
        console.log('loadPerson', loadPerson);
        // appButton.processForm.call(appButton, event); // submitForm 메서드 호출
        this.handleUpdateButtonClick(event);
      }
    }
  }

  // 등록 버튼 클릭 이벤트 핸들러
  async handleSaveButtonClick(event) {
    const formData = new FormData();
    await this.processForm(event, formData, formDataCallback);
    // event.preventDefault();
    // console.log("add Button Click!");

    // const appButton = event.target.closest("app-button");
    // if (appButton) {
    //   appButton.dispatchEvent(new Event("submitForm")); // 폼 제출 이벤트 발생
    // }
  }

  // 수정 버튼 클릭 이벤트 핸들러
  async handleUpdateButtonClick(event) {
    const formData = new FormData();
    const idToUpdate = Number(event.target.id);
    const dataToUpdate = await loadContact(idToUpdate);
    if (dataToUpdate) {
      console.log("Loaded data to update:", dataToUpdate);
      await this.processForm(event, formData, formDataCallback);
    } else {
      console.error("Failed to load data to update.");
    }

    // event.preventDefault();
    // console.log("update Button Click!");
  
    // const appButton = event.target.closest("app-button");
    // if (appButton) {
    //   const idToUpdate = Number(event.target.id);
    //   const dataToUpdate = await loadContact(idToUpdate);
  
    //   if (dataToUpdate) {
    //     console.log("Loaded data to update:", dataToUpdate);
    //     // 수정 폼 데이터를 불러오고 폼 제출 이벤트를 발생시킵니다.
    //     this.updateForm(dataToUpdate);
    //   } else {
    //     console.error("Failed to load data to update.");
    //   }
    // }
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
    console.log("inputElement", inputElement.name);
    console.log("inputValue", inputValue);
    if (inputElement.required && !inputValue) {
      inputElement.classList.add("required");
      return false; // 유효성 검사 실패
    }
    inputElement.classList.remove("required");
    return inputValue; // 유효성 검사 통과한 값 반환
  }

  validateSelect(selectElement) {
    const inputElement =
      selectElement.shadowRoot.querySelector("app-modal-input");

    if (selectElement && !inputElement) {
      console.log("selectElement", selectElement);
      console.log("inputElement", inputElement);
      console.log("inputElement가 존재하는데?");
      const selectValue =
        selectElement.shadowRoot.querySelector("select").value;
      if (selectElement.required && !selectValue) {
        selectElement.classList.add("required");
        return false; // 유효성 검사 실패
      }
      selectElement.classList.remove("required");
      return selectValue; // 유효성 검사 통과한 값 반환
    } else {
      const inputValue = inputElement.shadowRoot.querySelector("input").value;
      if (inputElement.required && !inputValue) {
        inputElement.classList.add("required");
        return false; // 유효성 검사 실패
      }
      inputElement.classList.remove("required");
      return inputValue; // 유효성 검사 통과한 값 반환
    }
  }

  processForm(event, formData) {
    event.preventDefault();

    let selectValid = true;
    let requiredInputsFilled = true;

    const selectElement = document.querySelector("#contact_group_select");
    const elementSelect = selectElement.shadowRoot.querySelector("select");

    if (selectElement && elementSelect) {
      const selectValue = this.validateSelect(selectElement);
      formData.append("contact_group", selectElement);
      if (!selectValue) {
        selectValid = false;
      }
    }

    const modalInputs = document.querySelector("#addEdit").querySelectorAll("app-modal-input");

    modalInputs.forEach((modalInput) => {
      const inputElement = modalInput.shadowRoot.querySelector("input");
      const inputName = inputElement.getAttribute("name");
      const validatedValue = this.validateInput(inputElement);
      console.log('validatedValue', validatedValue);

      if (validatedValue) {
        formData.append(inputName, validatedValue);
      } else {
        requiredInputsFilled = false;
      }
    });
    
    if (!selectValid || !requiredInputsFilled) {
      if (!selectValid) {
        alert("유효한 연락처 그룹을 선택해주세요.");
      }
      if (!requiredInputsFilled) {
        alert("필수 입력값을 채워주세요.");
      }
      return false;
    }
  
    if (formDataCallback) {
      const success = formDataCallback(formData);
      if (success) {
        this.resetModal();
      }
    }
  }

  // 폼 제출 함수
  // submitForm(event) {
  //   event.preventDefault();
  //   console.log("submitForm 실행");

  //   const formData = new FormData();
  //   this.processForm(formData);
  // }

  // 업데이트 폼 제출 함수
  // updateForm(event) {
  //   event.preventDefault();
  //   console.log("updateForm 실행", event.target.id);
    
  //   const formData = new FormData();
  //   this.processForm(formData);
  // }

  resetModal() {
    // 입력 필드 초기화
    const modalInputs = document.querySelectorAll("app-modal-input");

    //modalSelect 초기화 해야함

    modalInputs.forEach((modalInput) => {
      const inputElement = modalInput.shadowRoot.querySelector("input");
      inputElement.value = "";
    });

    const modalElement = document.querySelector("#addEdit");
    modalElement.querySelector("button").click();

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