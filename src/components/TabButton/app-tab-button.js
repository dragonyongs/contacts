import { clearModalContent } from "../../eventHandlers/modalEvents.js";

import { listContact, triggerContactUpdateEvent } from "../../eventHandlers/contactEvents.js";

export class AppTabButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.vibrate = this.vibrate.bind(this);
  }

  get id() {
    return this.getAttribute("id");
  }

  get icon() {
    return this.getAttribute("data-icon") || "help-outline";
  }

  get size() {
    return this.getAttribute("data-size") || "small";
  }

  get class() {
    return this.getAttribute("class") || '';
  }

  // 진동을 발생시키는 멤버 메서드
  vibrate() {
    navigator.vibrate([200, 100]);
  }

  template(state) {
    return `
            <link rel="stylesheet" href="./src/components/TabButton/app-tab-button.css">
            <button id="${state.id}" class="${state.class}" type="button" role="button">
                <ion-icon name="${state.icon}" size="${state.size}"></ion-icon>
                <slot name="label"></slot>
            </button>
        `;
  }


  connectedCallback() {
    this.render();
    
    this.addEventListener("click", this.handleButtonClick.bind(this));
  }

  render() {
    this.shadowRoot.innerHTML = this.template({
      id: this.id,
      class: this.class,
      name: this.name,
      icon: this.icon,
      size: this.size,
    });
  }

  handleButtonClick(event) {
    const buttonId = event.target.id || event.currentTarget.id;
    const isScroll = document.body.classList.contains("overflow-hidden");

    if (!isScroll) {
        document.body.classList.add("overflow-hidden");
    } 
  
    switch (buttonId) {
      case "list":
        this.handleListButtonClick();
        break;
      case "add":
        this.handleAddButtonClick();
        break;
      case "search":
        this.handleSearchButtonClick();
        break;
      case "data":
        this.handleDataButtonClick();
        break;
      default:
        console.log("Unknown button clicked!");
    }
  }
  

  handleListButtonClick() {
    const isActive = document.body.classList.contains("active");

    this.vibrate();
    listContact();

    if (isActive) {
      document.body.classList.remove("active", "overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    document.getElementById("searchForm").querySelector("input").value = "";
  }
  
  handleAddButtonClick() {
      this.vibrate();
      clearModalContent();
  }
  
  handleSearchButtonClick() {
      this.vibrate();
  }
  
  handleDataButtonClick() {
      this.vibrate();
  }
}

customElements.define("app-tab-button", AppTabButton);

    // import { setupExcelService } from "../../services/excelService.js";
    // import { getDataDB } from "../../services/dataDB.js";
    // this.notification = this.notification.bind(this);

    // 모달 창이 오픈될때 뒤에 있는 바디 스크롤을 제한하려고 overflow-hidden을 추가했는데
    // 모달 창이 닫히면 함게 제거해줘야하고, 만약 탭 버튼을 연속으로 눌러서 다른 모달이 열릴 경우 overflow-hidden은 유효한 상태야
    // 그러기 위해서 active 클래스를 추가해서 이 경우 이걸 유지하게 하는 요소로 사용했어
    // active가 존재하면 overflow-hidden을 제거하지 않고 active가 없다면 제거
    // 하지만 스스로를 두번 클릭했을때는 제거


