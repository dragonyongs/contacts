import { clearModalContent } from "../../eventHandlers/modalEvents.js"

let formDataCallback; // formDataCallback 함수를 위한 전역 변수 선언

export function setFormDataCallback(callback) {
  formDataCallback = callback; // formDataCallback 함수를 설정하는 함수 정의
}

export class AppButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
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
    if (this.type === "submit") {
      this.addEventListener("click", this.submitForm.bind(this));
    }

    // 'remove-overflow' 클래스가 버튼에 추가되어 있는 경우에만 처리
    if (this.classList.contains("remove-overflow")) {
      this.addEventListener("click", () => {
        console.log("close");

        // 모달 내의 요소들을 초기화하는 함수 호출
        clearModalContent();

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

  render() {
    this.shadowRoot.innerHTML = this.template({
      id: this.id,
      type: this.type,
      for: this.for,
      class: this.class,
      role: this.role,
      iconName: this.iconName,
      iconSize: this.iconSize,
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

  // 폼 제출 함수
  submitForm(event) {
    event.preventDefault();

    console.log("submitForm 실행");

    const formData = new FormData();
    // let firstInvalidInput = null;
    let selectValid = true; // 셀렉트 값이 유효한지 여부를 저장할 변수
    const selectElement = document.querySelector("#contact_group_select");
    const costumSelect = selectElement.shadowRoot.querySelector("select");
    if (costumSelect) {
      const selectValue = costumSelect.value;
      if (!selectValue) {
        console.log("value: false");
        // 셀렉트 요소이고 값이 유효하지 않을 경우
        selectValid = false;
      }
    }

    const modalInputs = document.querySelectorAll("app-modal-input");
    modalInputs.forEach((modalInput) => {
      const inputElement = modalInput.shadowRoot.querySelector("input");
      const inputName = inputElement.getAttribute("name");
      const validatedValue = this.validateInput(inputElement);

      if (validatedValue) {
        formData.append(inputName, validatedValue);
      }
    });
    console.log("selectValid", selectValid);

    if (!selectValid) {
      // 유효하지 않은 입력값이 있거나 셀렉트 값이 선택되지 않은 경우
      if (!selectValid) {
        alert("app-button 유효한 연락처 그룹을 선택해주세요.");
      }
      return false;
    }

    if (formDataCallback) {
      // formDataCallback이 정의되어 있을 때만 호출
      const success = formDataCallback(formData); // 외부에서 전달된 콜백 함수 호출
      if (success) {
        // 성공했을 때 모달 닫기
        this.closeModal();
      }
    }
  }

  closeModal() {
    // 입력 필드 초기화
    const modalInputs = document.querySelectorAll("app-modal-input");

    modalInputs.forEach((modalInput) => {
      const inputElement = modalInput.shadowRoot.querySelector("input");
      inputElement.value = "";
    });

    document.body.classList.remove("overflow-hidden");
    document.body.classList.remove("active");

    // 외부 컴포넌트에서 이벤트 발생
    window.dispatchEvent(
      new CustomEvent("close-modal", { detail: { open: false } })
    );
  }
}

customElements.define("app-button", AppButton);

document.dispatchEvent(new CustomEvent("closeModal"));
