export class AppModalInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  get id() {
    return this.getAttribute("id") || "";
  }

  get name() {
    return this.getAttribute("name") || "";
  }

  get type() {
    return this.getAttribute("type") || "text";
  }

  get label() {
    return this.getAttribute("data-label") || "";
  }

  get value() {
    return this.getAttribute("value") || "";
  }

  get required() {
    return this.getAttribute("required") || "";
  }

  get inputmode() {
    return this.getAttribute("inputmode") || "";
  }

  get pattern() {
    return this.getAttribute("pattern") || "";
  }

  template(state) {
    return `
            <link rel="stylesheet" href="./src/components/ModalInput/app-modal-input.css">
            <div class="input-wrap">
                <input type="${state.type}" name="${state.name}" id="${
      state.id
    }" value="${state.value}" placeholder=" " ${
      state.required === "true" ? "required" : ""
    } inputmode="${state.inputmode}" pattern="${state.pattern}" autocomplete="off" />
                <label for="${state.id}">${state.label}</label>
            </div>
        `;
  }

  formatPhoneNumber(input) {
    let cleaned = input.value.replace(/\D/g, ""); // 숫자가 아닌 모든 문자 제거
    let match;

    // 대한민국 전화번호 형식에 맞게 분기 처리
    if (cleaned.length <= 2) {
      match = cleaned.match(/^(\d{1,2})$/);
    } else if (cleaned.startsWith("02")) {
      // 서울 지역번호 (02) 처리
      match = cleaned.match(/^(\d{2})(\d{0,4})(\d{0,4})$/);
    } else if (cleaned.length <= 10) {
      // 다른 지역번호 처리
      match = cleaned.match(/^(\d{3})(\d{0,4})(\d{0,4})$/);
    } else {
      // 모바일 및 기타 번호 처리
      match = cleaned.match(/^(\d{3})(\d{0,4})(\d{0,4})$/);
    }

    // 입력값에 대한 처리 결과를 input의 value로 설정
    if (match) {
      input.value = `${match[1]}${match[2] ? "-" + match[2] : ""}${
        match[3] ? "-" + match[3] : ""
      }`;
    }
  }

  connectedCallback() {
    this.render();
    this.shadowRoot.addEventListener("focusout", (e) => {
      if (e.target.matches("input")) {
        this.validateInput(e.target);
        e.target.addEventListener("input", () => this.validateInput(e.target));
      }
    });
  }

  addInputEventListeners() {
    const modalInputs = this.shadowRoot.querySelectorAll("app-modal-input");
    modalInputs.forEach((modalInput) => {
      const inputElement = modalInput.shadowRoot.querySelector("input");
      inputElement.addEventListener("input", () =>
        this.validateInput(inputElement)
      );
    });
  }

  validateInput(inputElement) {
    if (inputElement.required && inputElement.value.trim()) {
      inputElement.classList.remove("required");
    } else if (inputElement.required && !inputElement.value.trim()) {
      inputElement.classList.add("required");
    }

    // data-id 속성 값의 마지막 부분이 'number'로 끝나는지 확인
    const dataId = inputElement.getAttribute("id");
    if (dataId && dataId.split("_").pop() === "number") {
      return this.formatPhoneNumber(inputElement); // 전화번호 형식화 함수 호출
    }
  }

  render() {
    this.shadowRoot.innerHTML = this.template({
      id: this.id,
      name: this.name,
      type: this.type,
      label: this.label,
      value: this.value,
      required: this.required,
      inputmode: this.inputmode,
      pattern: this.pattern,
    });
  }
}

customElements.define("app-modal-input", AppModalInput);
