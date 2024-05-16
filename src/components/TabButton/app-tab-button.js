import { clearModalContent } from "../../eventHandlers/modalEvents.js";
// import { setupExcelService } from "../../services/excelService.js";
// import { getDataDB } from "../../services/dataDB.js";
import { listContact, triggerContactUpdateEvent } from "../../eventHandlers/contactEvents.js";

export class AppTabButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.vibrate = this.vibrate.bind(this);
    // this.notification = this.notification.bind(this);
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
  
    if (this.classList.contains("remove-overflow")) {
      this.addEventListener("click", this.handleButtonClick.bind(this));
    }
  
    //   this.addEventListener("click", () => {
 

    //     // if (isActive && isScrollNot) {
    //     //   return;
    //     // }


    //   });
      
    // }

    // this.addEventListener("click", function (e) {
    //   let id = this.id.trim();
    //   const message = (id) => {
    //     // return alert(id.toUpperCase() + ' : PWA 전환 후 작업 예정');
    //     return console.log(id + " Clicked!");
    //   };

    //   switch (id) {
    //     case "list":
    //       this.vibrate();
    //       message(id);
    //       triggerContactUpdateEvent();
    //       break;
    //     case "add":
    //       this.vibrate();
    //       message(id);
    //       clearModalContent();
    //       break;
    //     case "search":
    //       this.vibrate();
    //       message(id);
    //       break;
    //     case "data":
    //       this.vibrate();
    //       // const database = await getDataDB();
    //       // setupExcelService(database); // Excel 서비스 설정
    //       message(id);
    //       break;
    //     case "edit":
    //       this.vibrate();
    //       message(id);
    //       break;
    //     case "detail":
    //       this.vibrate();
    //       message(id);
    //       break;  
    //     default:
    //       console.log("Wrong Action!");
    //   }
    // });

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
    const buttonId = event.target.id || event.currentTarget.id;;
    const isActive = document.body.classList.contains("active");
    const isScrollNot = document.body.classList.contains("overflow-hidden");

    if (!isActive && !isScrollNot) {
      document.body.classList.add("active", "overflow-hidden");
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
    this.vibrate();
    listContact();
    document.body.classList.remove("active", "overflow-hidden");
    document.getElementById("searchForm").querySelector("input").value = "";
  }
  
  handleAddButtonClick() {
      this.vibrate();
      console.log("add Clicked!", );
      clearModalContent();
  }
  
  handleSearchButtonClick() {
      this.vibrate();
      console.log("search Clicked!");
  }
  
  handleDataButtonClick() {
      this.vibrate();
      console.log("data Clicked!");
  }
}

customElements.define("app-tab-button", AppTabButton);
