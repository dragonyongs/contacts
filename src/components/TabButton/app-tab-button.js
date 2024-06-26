import { clearModalContent } from "../../eventHandlers/modalEvents.js";
import { listContact } from "../../eventHandlers/contactEvents.js";
import { changeThemeColor } from "../../utils/changeThemeColor.js";

const icons = {
  'search-outline': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="search"><g><path d="m20.71 19.29-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8 7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42zM5 11a6 6 0 1 1 6 6 6 6 0 0 1-6-6z"></path></g></svg>`,
  'add-outline': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="add-account"><path d="M21,10.5H20v-1a1,1,0,0,0-2,0v1H17a1,1,0,0,0,0,2h1v1a1,1,0,0,0,2,0v-1h1a1,1,0,0,0,0-2Zm-7.7,1.72A4.92,4.92,0,0,0,15,8.5a5,5,0,0,0-10,0,4.92,4.92,0,0,0,1.7,3.72A8,8,0,0,0,2,19.5a1,1,0,0,0,2,0,6,6,0,0,1,12,0,1,1,0,0,0,2,0A8,8,0,0,0,13.3,12.22ZM10,11.5a3,3,0,1,1,3-3A3,3,0,0,1,10,11.5Z"></path></svg>`,
  'list-outline': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="list"><g><g><circle cx="4" cy="7" r="1"></circle><circle cx="4" cy="12" r="1"></circle><circle cx="4" cy="17" r="1"></circle><rect width="14" height="2" x="7" y="11" rx=".94" ry=".94"></rect><rect width="14" height="2" x="7" y="16" rx=".94" ry=".94"></rect><rect width="14" height="2" x="7" y="6" rx=".94" ry=".94"></rect></g></g></svg>`,
  'data-outline': `<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 512 512" viewBox="0 0 512 512" id="file"><path d="M415.851,208c-0.004-4.158-1.479-8.254-4.538-11.313l-128-128c-3.059-3.069-7.154-4.558-11.313-4.558V64h-96c-44.109,0-80,35.891-80,80v224c0,44.109,35.891,80,80,80h160c44.109,0,80-35.891,80-80V208H415.851z M288,118.625L361.375,192H336c-26.469,0-48-2.531-48-48V118.625z M336,416H176c-26.469,0-48-21.531-48-48V144c0-26.469,21.531-48,48-48h80v48c0,44.109,5.891,80,80,80h48v144C384,394.469,362.469,416,336,416z M336,352c0,8.844-7.164,16-16,16H192c-8.836,0-16-7.156-16-16s7.164-16,16-16h128C328.836,336,336,343.156,336,352z M336,288c0,8.844-7.164,16-16,16H192c-8.836,0-16-7.156-16-16s7.164-16,16-16h128C328.836,272,336,279.156,336,288z M176,224c0-8.844,7.164-16,16-16h32c8.836,0,16,7.156,16,16s-7.164,16-16,16h-32C183.164,240,176,232.844,176,224z"></path></svg>`,
}

export class AppTabButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isVibrationSupported = this.isVibrationSupported.bind(this);
    this.vibratePattern = this.vibratePattern.bind(this);
  }

  get id() {
    return this.getAttribute("id");
  }

  get icon() {
    return this.getAttribute("data-icon") || "";
  }

  get size() {
    return this.getAttribute("data-size") || "small";
  }

  get class() {
    return this.getAttribute("class") || '';
  }

  isVibrationSupported() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
    // iOS 및 사파리인지 확인
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
  
    // iOS 또는 사파리에서는 진동 기능을 지원하지 않음
    if (isIOS || isSafari) {
      return false;
    }
  
    // 그 외의 경우(안드로이드 또는 크롬)에서는 진동 기능을 지원
    return 'vibrate' in navigator;
  }

  vibratePattern() {
    if (this.isVibrationSupported()) {
      navigator.vibrate([200, 100]);
    } else {
      console.log("이 장치에서는 진동 기능을 지원하지 않습니다.");
    }
  }

  template(state) {
    return `
      <link rel="stylesheet" href="./src/components/TabButton/app-tab-button.css">
      <button id="${state.id}" class="${state.class}" type="button" role="button">
        <div class="icon ${state.size}">
          ${icons[state.icon]}
        </div>
        <slot name="label"></slot>
      </button>
    `;
  }

  connectedCallback() {
    this.render();
    this.addEventListener("click", this.handleButtonClick.bind(this));
    this.addEventListener("touchend", this.handleButtonClick.bind(this));
    console.log("Button connected:", this.id);
  }

  render() {
    this.shadowRoot.innerHTML = this.template({
      id: this.id,
      class: this.class,
      icon: this.icon,
      size: this.size,
    });
  }

  handleButtonClick(event) {
    const buttonId = event.currentTarget.id;
    console.log(`Button clicked: ${buttonId}`);
  
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
  
  async handleListButtonClick() {
    const isActive = document.body.classList.contains("active");
    console.log(`isActive: ${isActive}`);
  
    if (isActive) {
      document.body.classList.remove("active");
      document.body.classList.remove("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  
    try {
      await listContact();
      changeThemeColor('#1e293b');
      document.getElementById("searchForm").querySelector("input").value = "";
      console.log('listContact completed');
      this.vibratePattern();
    } catch (error) {
      console.error('Error in listContact:', error);
    }
  }
  
  handleAddButtonClick() {
    this.vibratePattern();
    clearModalContent();
  }
  
  handleSearchButtonClick() {
    this.vibratePattern();
  }
  
  handleDataButtonClick() {
    this.vibratePattern();
  }
}

customElements.define("app-tab-button", AppTabButton);