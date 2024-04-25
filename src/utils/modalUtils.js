function handleOutsideClick() {
  console.log("handleOutsideClick 실행");
  
  if (this.modalState === "add" || this.modalState === "search" || this.modalState === "edit") {
    // 모달 안의 모든 app-modal-input 요소를 선택한다.
    const modalInputElements = document.querySelectorAll('#contact-form app-modal-input');
    const modalSelectElement = document.querySelector('#contact-form app-modal-select');

    // 각 app-modal-input 요소의 shadowRoot에 접근하여 input 요소를 찾고 값을 비운다.
    modalInputElements.forEach(modalInput => {
      // app-modal-input 요소의 shadowRoot에 접근한다.
      const shadow = modalInput.shadowRoot;

      // shadowRoot에서 input 요소를 선택한다.
      const inputElement = shadow.querySelector('input');

      // input 요소의 값을 비운다.
      inputElement.value = '';

      // console.log('Input Reset for', modalInput.getAttribute('data-label'));
    });

    const selectShadow = modalSelectElement.shadowRoot;

    if(selectShadow.value){
      selectShadow.querySelector('select').value = '';
  
      // console.log('Select Reset for', modalSelectElement.getAttribute('data-label'));
    }

    console.log('addEdit Input/Select Reset!');

    // select 조건 추가 예정
}

  if (this.modalState === "add" || this.modalState === "search" || this.modalState === "data" || this.modalState === "edit" || this.modalState === "detail") {
    console.log('???');
    this.modalOpen = false;
    this.modalState = '';
    document.body.classList.remove("active", "overflow-hidden");
  }
  
}
