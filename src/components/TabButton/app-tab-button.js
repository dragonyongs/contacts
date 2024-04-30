export class AppTabButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.vibrate = this.vibrate.bind(this);
    this.showNotification = this.showNotification.bind(this);
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

   // 진동을 발생시키는 멤버 메서드
  vibrate() {
    navigator.vibrate([200, 100]);
  }

  showNotification() {
    // 사용자에게 보여질 알림의 옵션 설정
    const options = {
      body: '스타리치에 새로운 소식이 왔습니다.',
      icon: '/public/icons/common/icon-notification.png', // 알림에 표시될 아이콘 이미지 URL
      vibrate: [200, 100, 200, 100, 300], // 진동 패턴 (옵션)
      data: {
        url: 'https://starrich.co.kr' // 클릭시 열릴 링크 (옵션)
      }
    };
  
    // 알림 표시 요청
    if (Notification.permission === 'granted') {
      // 사용자가 알림을 허용한 경우
      new Notification('새로운 알림!', options);
    } else if (Notification.permission !== 'denied') {
      // 사용자가 알림을 거절하지 않은 경우
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('새로운 알림!', options);
        }
      });
    }
  }

  template(state) {
    return `
            <link rel="stylesheet" href="./src/components/TabButton/app-tab-button.css">
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
          console.log("isActive!");
          return;
        }

        if (!isActive && !isScrollNot) {
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
          this.vibrate();
          break;
        case "search":
          message(id);
          this.showNotification();
          break;
        case "data":
          message(id);
          this.vibrate();
          break;
        case "edit":
          this.vibrate();
          message(id);
          break;
        case "detail":
          this.vibrate();
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
