function requiredFieldsCheck() {
  console.log("requiredFieldsCheck 실행");

  let requiredFieldsEmpty = false;
  const modalInputElements = document.querySelectorAll('#contact-form app-modal-input');
  const modalSelectElement = document.querySelector('#contact-form app-modal-select');
  const selectShadow = modalSelectElement.shadowRoot;
  
  modalInputElements.forEach(modalInput => {
    const shadow = modalInput.shadowRoot;
    const inputElement = shadow.querySelector('input');

    if (inputElement.required && inputElement.value === '') {
      requiredFieldsEmpty = true;
      return;
    }

  })

  // 필수 선택 항목인지 확인한다.
  if (modalSelectElement.required && !selectShadow.value) {
    requiredFieldsEmpty = true;
  } 

  // 필수 입력 항목이 비어 있으면 모달을 닫지 않고 함수를 종료한다.
  if (requiredFieldsEmpty) {
    console.log('필수 입력 항목이 비어 있습니다. 모달을 닫지 않습니다.');
    return false;
  }

  return true;
}

function handleOutsideClick() {
  // if (this.modalTabState === "add" && !requiredFieldsCheck()) {
  //   return;
  // } 

  // 필수 입력 항목이 있는지 여부를 나타내는 변수
  console.log('this.modalTabState', this.modalTabState)

  if (this.modalTabState === "add" || this.modalTabState === "search" || this.modalTabState === "edit") {
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
    });

    const selectShadow = modalSelectElement.shadowRoot;
    if(selectShadow.value) {
      selectShadow.querySelector('select').value = '';
    }

    console.log('addEdit Input/Select Reset!');
  }

  console.log("handleOutsideClick 실행");
  
  if (this.modalState === "detail" && (this.modalTabState === "add" || this.modalTabState === "search" || this.modalTabState === "edit")) {
    console.log('detail modalClose!');
    this.modalOpen = true;
    this.modalState = 'detail';
    this.modalTabState = '';
  } else {
    console.log('modalClose!');
    this.modalOpen = false;
    this.modalState = '';
    this.modalTabState = '';
    document.body.classList.remove("active", "overflow-hidden");
  }
}

// 정리

// 등록 버튼 클릭 이벤트 핸들러
// function handleRegisterButtonClick() {

//   console.log('handleRegisterButtonClick');

//   if (this.modalTabState === "add" || this.modalTabState === "search" || this.modalTabState === "edit") {
//     const modalInputElements = document.querySelectorAll('#contact-form app-modal-input');
//     const modalSelectElement = document.querySelector('#contact-form app-modal-select');

//     let requiredFieldsEmpty = false;

//     modalInputElements.forEach(modalInput => {
//       const shadow = modalInput.shadowRoot;
//       const inputElement = shadow.querySelector('input');

//       if (inputElement.required && inputElement.value === '') {
//         requiredFieldsEmpty = true;
//         return;
//       }
//     });

//     const selectShadow = modalSelectElement.shadowRoot;

//     if (modalSelectElement.required && !selectShadow.value) {
//       requiredFieldsEmpty = true;
//     }

//     if (requiredFieldsEmpty) {
//       console.log('필수 입력 항목이 비어 있습니다. 모달을 닫지 않습니다.');
//       return;
//     }
//   }

// }

// // 닫기 버튼 클릭 이벤트 핸들러
// function handleCloseButtonClick() {

//   if (this.modalTabState === "add" || this.modalTabState === "search" || this.modalTabState === "edit") {
//     // 모달 안의 모든 app-modal-input 요소를 선택한다.
//     const modalInputElements = document.querySelectorAll('#contact-form app-modal-input');
//     const modalSelectElement = document.querySelector('#contact-form app-modal-select');

//     // 각 app-modal-input 요소의 shadowRoot에 접근하여 input 요소를 찾고 값을 비운다.
//     modalInputElements.forEach(modalInput => {
//       // app-modal-input 요소의 shadowRoot에 접근한다.
//       const shadow = modalInput.shadowRoot;

//       // shadowRoot에서 input 요소를 선택한다.
//       const inputElement = shadow.querySelector('input');

//       console.log( inputElement.value )
//       // input 요소의 값을 비운다.
//       inputElement.value = '';
//     });

//     const selectShadow = modalSelectElement.shadowRoot;

//     // 필수 선택 항목인지 확인한다.
//     if (!selectShadow.value) {
//       selectShadow.querySelector('select').value = '';
//     }

//     console.log('addEdit Input/Select Reset!');

//   }

  
//   if (this.modalState === "detail" && (this.modalTabState === "add" || this.modalTabState === "search" || this.modalTabState === "edit")) {
//     console.log('modalClose!');
//     this.modalOpen = true;
//     this.modalState = 'detail';
//     this.modalTabState = '';
//   } else {
//     this.modalOpen = false;
//     this.modalState = '';
//     this.modalTabState = '';
//     document.body.classList.remove("active", "overflow-hidden");
//   }

  

// }