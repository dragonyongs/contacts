// 모달이 닫힐 때 모달 내의 요소들을 초기화하는 함수
export function clearModalContent() {
    console.log('clearModalContent 실행!');
    // 상위 요소 선택
    const detailHeaderElement = document.querySelector('.detailHeader');

    // 자식 요소 선택
    const familyNameElement = detailHeaderElement.querySelector('.family_name');
    const photoUrlElement = detailHeaderElement.querySelector('.photo_url_img');
    const photoUrlBgElement = detailHeaderElement.querySelector('.photo_url_bg');

    // hidden 클래스 제거
    familyNameElement.classList.remove('hidden');
    photoUrlElement.classList.remove('hidden');
    photoUrlBgElement.classList.remove('hidden');
}