import { triggerContactUpdateEvent } from "../../eventHandlers/contactEvents.js";

export class AppListCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  get contactData() {
    return JSON.parse(this.getAttribute("data-contactData"));
  }

  get id() {
    return this.getAttribute("id") || "";
  }

  get groupId() {
    return this.getAttribute("data-group") || "groups-none";
  }

  get statusInfo() {
    const status = this.contactData.status.trim() || "";
    switch (status) {
      case "연차":
        return { status: status, text: "연차", class: "dayoff" };
      case "행사":
        return { status: status, text: "행사", class: "event" };
      case "병가":
        return { status: status, text: "병가", class: "sick" };
      case "출장":
        return { status: status, text: "출장", class: "business" };
      case "퇴사":
        return { status: status, text: "퇴사", class: "leave" };
      default:
        return { status: "default", text: "", class: "" };
    }
  }

// 색상 코드 배열

template(state) {

  const statusInfo = this.statusInfo;
  const groupId = state.groupId;
  const colorCodes = [
    '#C4B5D6', // 연한 보라색
    '#B5D6C4', // 연한 민트색
    '#D6C4B5', // 연한 베이지색
    '#D6B5C4', // 연한 핑크색
    '#C4D6B5', // 연한 연두색
    '#D6C4C4', // 연한 살구색
    '#C4B5C4', // 연한 라벤더색
    '#B5C4D6', // 연한 하늘색
    '#D6B5B5', // 연한 복숭아색
    '#C4C4D6'  // 연한 라일락색
  ];
  const backgroundColor = colorCodes[groupId % colorCodes.length];

  return `
    <link rel="stylesheet" href="./src/components/ListCard/app-list-card.css">
    <li id="${state.id}" data-id="contact-id-${state.contact_id}" ${
      statusInfo.status ? `class="${statusInfo.class}"` : ""
    }>
      <div class="img-wrap" style="background-color: ${backgroundColor};">
        ${
          state.photo_url
            ? `<img src="${state.photo_url}" alt="" class="object-contain">`
            : `${state.family_name}`
        }
      </div>
      <div class="info-wrap">
        <div>
          <div class="info">
            <p class="name">${state.full_name} <span class="role">${
      state.rank ? state.rank : state.position
    } ${state.rank && state.position ? `/ ${state.position}` : ''}</span></p>
            ${
              statusInfo.status !== "default"
                ? `<span class="status">${statusInfo.text}</span>`
                : ""
            }
          </div>
          <p class="team">${state.team_name} ${
      state.team_name && state.extension_number
        ? `(내선 <span class="extension_number">${state.extension_number}</span>)`
        : `${state.personal_phone_number}`
    }</p>
        </div>
        <div class="icon-wrap">
          <svg fill="#000000" width="24" height="24" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8.489 31.975c-0.271 0-0.549-0.107-0.757-0.316-0.417-0.417-0.417-1.098 0-1.515l14.258-14.264-14.050-14.050c-0.417-0.417-0.417-1.098 0-1.515s1.098-0.417 1.515 0l14.807 14.807c0.417 0.417 0.417 1.098 0 1.515l-15.015 15.022c-0.208 0.208-0.486 0.316-0.757 0.316z"></path> </g></svg>
        </div>
      </div>
    </li>
  `;
}

// <p class="team">${state.division_name} ${ state.division_name && state.team_name ? `/ ${state.team_name}` : `${state.division_name}` }</p>
  connectedCallback() {
    this.render();

    // ul 요소에 이벤트 리스너를 추가합니다.
    this.addEventListener("click", (e) => {

      // 모달 열리면 body scrool 제한
      document.querySelector("body").classList.add("active");
      document.querySelector("body").classList.add("overflow-hidden");

      // 상세 모달 오픈시 검색 인풋 초기화
      document.getElementById("searchForm").querySelector("input").value = "";
      triggerContactUpdateEvent();

        const customEvent = new CustomEvent("detail-modal", {
          bubbles: true,
          composed: true,
          detail: this.contactData,
        });
        document.dispatchEvent(customEvent);

        const customEditEvent = new CustomEvent("edit-modal", {
          bubbles: true,
          composed: true,
          detail: this.contactData,
        });
        document.dispatchEvent(customEditEvent);

    });
  }

  render() {
    // const family_name = this.contactData.full_name.charAt(0);
    this.shadowRoot.innerHTML = this.template({
      id: this.id,
      contact_id: this.contactData.contact_id,
      contact_group: this.contactData.contact_group,
      family_name: this.contactData.full_name.charAt(0),
      full_name: this.contactData.full_name,
      rank: this.contactData.rank,
      position: this.contactData.position,
      division_name: this.contactData.division_name,
      team_name: this.contactData.team_name,
      photo_url: this.contactData.photo_url,
      personal_phone_number: this.contactData.personal_phone_number,
      office_phone_number: this.contactData.office_phone_number,
      extension_number: this.contactData.extension_number,
      status: this.contactData.statusInfo,
      email_address: this.contactData.email_address,
      groupId: this.groupId,
    });
  }
}

customElements.define("app-list-card", AppListCard);
