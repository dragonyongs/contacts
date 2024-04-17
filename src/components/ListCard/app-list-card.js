export class AppListCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  get contact_id() {
    return this.getAttribute("data-contactId") || "";
  }

  get full_name() {
    return this.getAttribute("data-fullName").trim() || "";
  }

  get position() {
    return this.getAttribute("data-position").trim() || "";
  }

  get rank() {
    return this.getAttribute("data-rank").trim() || "";
  }

  get division_name() {
    return this.getAttribute("data-divisionName").trim() || "경영지원본부";
  }

  get statusInfo() {
    const status = this.getAttribute("data-status").trim() || "";
    switch (status) {
      case "dayoff":
        return { status: status, text: "연차" };
      case "event":
        return { status: status, text: "행사" };
      case "sick":
        return { status: status, text: "병가" };
      case "business":
        return { status: status, text: "출장" };
      case "leave":
        return { status: status, text: "퇴사" };
      default:
        return { status: "default", text: "" };
    }
  }

  get team_name() {
    return this.getAttribute("data-teamName").trim() || "";
  }

  get photo_url() {
    return this.getAttribute("data-photoUrl").trim() || "";
  }

  get personal_phone_number() {
    return this.getAttribute("data-personalNumber").trim() || "";
  }

  get office_phone_number() {
    return this.getAttribute("data-officeNumner").trim() || "";
  }

  get extension_number() {
    return this.getAttribute("data-extensionNumber").trim() || "";
  }

  get email_address() {
    return this.getAttribute("data-emailAddress").trim() || "";
  }

  template(state) {
    const statusInfo = this.statusInfo;
    const familyName = state.full_name.charAt(0);
    return `
                <link rel="stylesheet" href="../src/components/ListCard/app-list-card.css">
                <li id="contact-id-${state.contact_id}" ${
      statusInfo.status ? `class="${statusInfo.status}"` : ""
    }>
                    <div
                        class="img-wrap">
                        ${
                          state.photo_url
                            ? `<img src="${state.photo_url}"
                        alt="" class="object-contain">`
                            : `${familyName}`
                        }
                    </div>
                    <div class="info-wrap">
                        <div>
                            <div class="info">
                                <p class="name">${
                                  state.full_name
                                } <span class="role">${state.rank} ${
      state.position ? `/ ${state.position}` : ""
    }</span></p>
                                ${
                                  statusInfo.status !== "default"
                                    ? `<span class="status">${statusInfo.text}</span>`
                                    : ""
                                }
                            </div>
                            <p class="team">${state.team_name} / ${
      state.division_name
    }</p>
                        </div>
                        <div class="icon-wrap">
                            <svg fill="#000000" width="100%" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8.489 31.975c-0.271 0-0.549-0.107-0.757-0.316-0.417-0.417-0.417-1.098 0-1.515l14.258-14.264-14.050-14.050c-0.417-0.417-0.417-1.098 0-1.515s1.098-0.417 1.515 0l14.807 14.807c0.417 0.417 0.417 1.098 0 1.515l-15.015 15.022c-0.208 0.208-0.486 0.316-0.757 0.316z"></path> </g></svg>
                        </div>
                    </div>
                </li>
            `;
  }

  connectedCallback() {
    this.render();

    // ul 요소에 이벤트 리스너를 추가합니다.
    this.addEventListener("click", (e) => {
      // 클릭한 요소의 ID 값을 가져옵니다.
      const clickedElementId = e.target.contact_id;

      // ID 값에서 contact-id- 부분을 제외한 숫자 부분을 추출합니다.
      const contactId = clickedElementId.replace("contact-id-", "");

      // state.contact_id와 클릭한 요소의 ID 값의 일치 여부를 확인합니다.
      if (this.contact_id === contactId) {
        // 클릭한 요소의 ID 값과 state.contact_id가 일치하는 경우에만 커스텀 이벤트를 생성하고 전달합니다.
        const family_name = this.full_name.charAt(0);

        const eventData = {
          contact_id: this.contact_id,
          family_name: family_name,
          full_name: this.full_name,
          rank: this.rank,
          position: this.position,
          division_name: this.division_name,
          team_name: this.team_name,
          photo_url: this.photo_url,
          personal_phone_number: this.personal_phone_number,
          office_phone_number: this.office_phone_number,
          extension_number: this.extension_number,
          status: this.statusInfo,
          email_address: this.email_address,
        };

        const customEvent = new CustomEvent("detail-modal", {
          bubbles: true,
          composed: true,
          detail: eventData,
        });

        // 외부 컴포넌트에서 이벤트 발생
        window.dispatchEvent(
          new CustomEvent("detail-modal", { detail: { open: true } })
        );

        // 모달 열리면 body scrool 제한
        document.querySelector("body").classList.add("overflow-hidden");

        // console.log(customEvent);
        document.dispatchEvent(customEvent);
      }
    });
  }

  render() {
    const family_name = this.full_name.charAt(0);
    this.shadowRoot.innerHTML = this.template({
      contact_id: this.contact_id,
      family_name: family_name,
      full_name: this.full_name,
      rank: this.rank,
      position: this.position,
      division_name: this.division_name,
      team_name: this.team_name,
      photo_url: this.photo_url,
      personal_phone_number: this.personal_phone_number,
      office_phone_number: this.office_phone_number,
      extension_number: this.extension_number,
      status: this.statusInfo,
      email_address: this.email_address,
    });
  }
}

customElements.define("app-list-card", AppListCard);

// alert(
//     `${customEvent.detail.full_name} ${customEvent.detail.team_name} ${
//     customEvent.detail.status.text
//         ? `(${customEvent.detail.status.text})`
//         : ""
//     }\n${customEvent.detail.personal_phone_number}\n${
//     customEvent.detail.office_phone_number
//     }(${customEvent.detail.extension_number})`
// );
