export function clearList(elementId) {
    // console.log('elementId', elementId);
    const listContainer = document.getElementById(elementId);
    // console.log('listContainer', listContainer);
    listContainer.innerHTML = '';
}

export function blankMessage(elementId, message) {
    const listContainer = document.getElementById(elementId);
    listContainer.classList.add("h-full");

    const emptyMessageWrap = document.createElement("div");
    emptyMessageWrap.className = "w-full h-full bg-slate-50";
    emptyMessageWrap.innerHTML = `<div class="noData"><p>${message}</p></div>`;

    listContainer.appendChild(emptyMessageWrap);
}