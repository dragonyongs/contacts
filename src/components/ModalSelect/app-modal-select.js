import { getContactGroups } from "../../services/dataService.js";

export class AppModalSelect extends HTMLElement {
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

  get label() {
    return this.getAttribute("data-label") || "";
  }

  get required() {
    return this.getAttribute("required") || "";
  }

  get value() {
    return this.getAttribute("value") || "";
  }

  template(state) {
    const optionsHTML = state.groups
      .map(
        (group) =>
          `<option value="${group || ""}" ${group === state.value ? 'seleted': ''}>${group || "미지정"}</option>`
      )
      .join("");
    const selectHTML = `
            <select id="${state.id}" name="${state.name}" ${
      state.required === "true" ? "required" : ""
    } value="${state.value}">
                <option value="" selected disabled>연락처 그룹 선택</option>
                ${optionsHTML}
                <option value="직접입력">직접 입력</option>
            </select>
        `;
    const inputHTML = `
            <app-modal-input type="text" id="contact_group_input" name="contact_group" data-label="연락처 그룹" value=""
            class="hidden"></app-modal-input>
        `;

    return `
            <link rel="stylesheet" href="./src/components/ModalSelect/app-modal-select.css">
            <div class="select-wrap">
                ${state.groups.length === 0 ? "" : ""}
                ${state.groups.length === 0 ? inputHTML : selectHTML}
            </div>
        `;
  }

  selectEvent() {
    const selectElement = this.shadowRoot.querySelector("select");
    const inputElement = document.querySelector("#contact_group_input");

    selectElement.addEventListener("change", function () {
      if (this.value === "직접입력") {
        selectElement.remove();
        inputElement.classList.remove("hidden");
        inputElement.shadowRoot.querySelector('input').focus();
      }
    });
  }

  async connectedCallback() {
    // 연락처 그룹 데이터를 가져와서 셀렉트 요소에 추가
    const groups = await getContactGroups();
    this.render(groups);
    if (groups.length > 0) {
      this.selectEvent();
    }
  }

  render(groups) {
    this.shadowRoot.innerHTML = this.template({
      id: this.id,
      name: this.name,
      label: this.label,
      options: this.options,
      groups: groups,
      value: this.value,
      required: this.required,
    });
  }
}

customElements.define("app-modal-select", AppModalSelect);
