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

  // get contact_id() {
  //   return this.getAttribute("data-contactId") || "";
  // }

  // get full_name() {
  //   return this.getAttribute("data-fullName").trim() || "";
  // }

  // get position() {
  //   return this.getAttribute("data-position").trim() || "";
  // }

  // get rank() {
  //   return this.getAttribute("data-rank").trim() || "";
  // }

  // get contact_group() {
  //   return this.getAttribute("data-contactGroup").trim() || "";
  // }

  // get division_name() {
  //   return this.getAttribute("data-divisionName").trim() || "";
  // }

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

  // get team_name() {
  //   return this.getAttribute("data-teamName").trim() || "";
  // }

  // get photo_url() {
  //   return this.getAttribute("data-photoUrl").trim() || "";
  // }

  // get personal_phone_number() {
  //   return this.getAttribute("data-personalNumber").trim() || "";
  // }

  // get office_phone_number() {
  //   return this.getAttribute("data-officeNumner").trim() || "";
  // }

  // get extension_number() {
  //   return this.getAttribute("data-extensionNumber").trim() || "";
  // }

  // get email_address() {
  //   return this.getAttribute("data-emailAddress").trim() || "";
  // }

template(state) {
    const statusInfo = this.statusInfo;
    // const familyName = state.full_name.charAt(0);
    return `
                <link rel="stylesheet" href="./src/components/ListCard/app-list-card.css">
                <li id="${state.id}" data-id="contact-id-${state.contact_id}" ${
      statusInfo.status ? `class="${statusInfo.class}"` : ""
    }>
                    <div
                        class="img-wrap">
                        ${
                          state.photo_url
                            ? `<img src="${state.photo_url}"
                        alt="" class="object-contain">`
                            : `${state.family_name}`
                        }
                    </div>
                    <div class="info-wrap">
                        <div>
                            <div class="info">
                                <p class="name">${
                                  state.full_name
                                } <span class="role">${state.rank ? state.rank : state.position } ${ state.rank && state.position ? `/ ${state.position}` : ''}</span></p>
                                ${
                                  statusInfo.status !== "default"
                                    ? `<span class="status">${statusInfo.text}</span>`
                                    : ""
                                }
                            </div>
                            <p class="team">${state.team_name} ${ state.team_name && state.extension_number ? `(내선 <span class="extension_number">${state.extension_number}</span>)` : `${state.personal_phone_number}` }</p>
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

      // 클릭한 요소의 ID 값을 가져옵니다.
      // const clickedElementId = e.target
      //   .closest("app-list-card")
      //   .getAttribute("data-contactId");
      
      // const detailContact = this.contactData.contact_id;
      // console.log(this.contactData.contact_id);

      // state.contact_id와 클릭한 요소의 ID 값의 일치 여부를 확인합니다.
      // if (this.contact_id === detailContact) {
        // 클릭한 요소의 ID 값과 state.contact_id가 일치하는 경우에만 커스텀 이벤트를 생성하고 전달합니다.
        // const family_name = this.full_name.charAt(0);

        // const eventData = {
          // id: this.id,
          // contact_id: clickedElementId,
          // contact_group: this.contact_group,
          // family_name: family_name,
          // full_name: this.full_name,
          // rank: this.rank,
          // position: this.position,
          // division_name: this.division_name,
          // team_name: this.team_name,
          // photo_url: this.photo_url,
          // personal_phone_number: this.personal_phone_number,
          // office_phone_number: this.office_phone_number,
          // extension_number: this.extension_number,
          // status: this.statusInfo,
          // email_address: this.email_address,
        // };

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

        // 모달 열리면 body scrool 제한
      //   document.querySelector("body").classList.add("active");
      //   document.querySelector("body").classList.add("overflow-hidden");

      //   // 상세 모달 오픈시 검색 인풋 초기화
      //   document.getElementById("searchForm").querySelector("input").value = "";
      //   triggerContactUpdateEvent();
      // }
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
    });
  }
}

customElements.define("app-list-card", AppListCard);
