// 모달이 닫힐 때 모달 내의 요소들을 초기화하는 함수
export function clearModalContent() {
    const contactSelect = document.getElementById('contact_group_select').shadowRoot.querySelector('select');
    const contactForm = document.getElementById('contact-form');
    const inputElements = contactForm.querySelectorAll('app-modal-input');
    console.log('contactSelect', contactSelect);
    if (contactSelect) {
        let selectValue = contactSelect.value;
        selectValue = "";
    } else {
        inputElements.forEach(element => {
            let inputValue = element.shadowRoot.querySelector('input');
            inputValue.value = "";
        });
    }
}

export function resetDetailContent() {
    // 상위 요소 선택
    const detailHeaderElement = document.querySelector('.detailHeader');

    // 자식 요소 선택
    const photoUrlElement = detailHeaderElement.querySelector('.photo_url_img');
    const photoUrlBgElement = detailHeaderElement.querySelector('.photo_url_bg');
    photoUrlElement.classList.add('hidden');
    photoUrlBgElement.classList.add('hidden');

    photoUrlElement.src = "";
    photoUrlBgElement.style.backgroundImage = `url()`;

    // 테마 색상 원복
    const originalColor = "#1e293b";
    document.querySelector('meta[name="theme-color"]').setAttribute('content', originalColor);
}