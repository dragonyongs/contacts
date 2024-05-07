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
    const groupsCount = Number(state.groups.length);
    const optionsHTML = state.groups
      .map(
        (group) =>
          `<option value="${group || ""}" ${
            group === state.value ? "seleted" : ""
          }>${group || "미지정"}</option>`
      )
      .join("");

    const inputHTML = `
            <app-modal-input type="text" id="contact_group_input" name="contact_group" data-label="연락처 그룹" value=""></app-modal-input>
        `;

    const selectHTML = `
            <select id="${state.id}" name="${state.name}" ${
      state.required === "true" ? "required" : ""
    } value="${state.value}">
                <option value="" selected disabled>연락처 그룹 선택</option>
                ${optionsHTML}
                <option value="직접입력">직접 입력</option>
            </select>
        `;

    return `
            <link rel="stylesheet" href="./src/components/ModalSelect/app-modal-select.css">
            <div class="select-wrap">
                ${groupsCount === 0 ? inputHTML : selectHTML}
            </div>
        `;
  }

  selectEvent() {
    const selectElement = this.shadowRoot.querySelector("select");
    const deleteSelectElement = document.querySelector("#contact_group_select");
    const testWrap = document.querySelector("#insertContactGroup");

    selectElement.addEventListener("change", function () {
      if (this.value === "직접입력") {
        deleteSelectElement.remove();
        testWrap.innerHTML = `<app-modal-input type="text" id="contact_group_input" name="contact_group" data-label="연락처 그룹" value=""></app-modal-input>`;
        testWrap
          .querySelector("app-modal-input")
          .shadowRoot.querySelector("input")
          .focus();
      }
    });
  }

  async connectedCallback() {
    // 연락처 그룹 데이터를 가져와서 셀렉트 요소에 추가
    const groups = await getContactGroups();

    if (groups.length === 0) {
      // 그룹이 없는 경우에는 인풋 요소를 추가
      this.renderInput();
    } else {
      // 그룹이 있는 경우에는 셀렉트 요소를 추가
      this.renderSelect(groups);
      this.selectEvent();
    }
  }

  renderSelect(groups) {
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

  renderInput() {
    const inputHTML = `
      <app-modal-input type="text" id="contact_group_input" name="contact_group" data-label="연락처 그룹" value=""></app-modal-input>
    `;
    const insertContactGroup = document.querySelector("#insertContactGroup");
    insertContactGroup.innerHTML = inputHTML;
  }
}

customElements.define("app-modal-select", AppModalSelect);
