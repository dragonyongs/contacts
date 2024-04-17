export class AppTabButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
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

  template(state) {
    return `
            <link rel="stylesheet" href="../src/components/TabButton/app-tab-button.css">
            <button id="${state.id}" type="button" role="button">
                <ion-icon name="${state.icon}" size="${state.size}"></ion-icon>
                <slot name="label"></slot>
            </button>
        `;
  }

  connectedCallback() {
    this.render();

    // 'remove-overflow' 클래스가 버튼에 추가되어 있는 경우에만 처리
    if (this.classList.contains("remove-overflow")) {
      this.addEventListener("click", () => {
        const isActive = document.body.classList.contains("active");
        const isScrollNot = document.body.classList.contains("overflow-hidden");

        if (isActive && isScrollNot) {
          return;
        }

        if (!isScrollNot) {
          document.body.classList.add("active");
          document.body.classList.add("overflow-hidden");
        } else {
          document.body.classList.remove("active");
          document.body.classList.remove("overflow-hidden");
        }
      });
    }

    this.addEventListener("click", function (e) {
      let id = this.id.trim();
      const message = (id) => {
        // return alert(id.toUpperCase() + ' : PWA 전환 후 작업 예정');
        return console.log(id + " Clicked!");
      };

      switch (id) {
        case "list":
          message(id);
          window.location.href = "./";
          break;
        case "add":
          message(id);
          break;
        case "search":
          message(id);
          break;
        case "data":
          message(id);
          break;
        default:
          console.log("Wrong Action!");
      }
    });
  }

  render() {
    this.shadowRoot.innerHTML = this.template({
      id: this.id,
      name: this.name,
      icon: this.icon,
      size: this.size,
    });
  }
}

customElements.define("app-tab-button", AppTabButton);
