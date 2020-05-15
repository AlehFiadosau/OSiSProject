function fullScreen(dataValue) {
    let fullScreenCardElement = document.querySelector(".full-screen-card");

    if (fullScreenCardElement.children[0] != undefined) {
        let fullScreenElement = document.querySelector(".information-about-project__major-content_full-screen");
        let targetDataValue = +fullScreenElement.getAttribute("data-value");
        fullScreenCardElement.classList.remove("active");
        fullScreenCardElement.removeChild(fullScreenCardElement.children[0]);
        cardMajors[targetDataValue].classList.add("active");
    } else {
        callbackAjax.complete.func = setFullScreenDaat;
        callbackAjax.complete.params = [dataValue];
        ajaxQueryCalback("GET", "/fullScreenCard/", undefined, undefined, undefined, ".full-screen-card", callbackAjax);

        cardMajors[dataValue].classList.remove("active");
        fullScreenCardElement.classList.add("active");
    }
}

function setFullScreenDaat(dataValue) {
    let informAboutProject = document.querySelectorAll(".information-about-project__major-content");
    let imgForFullScreen = document.querySelector(".img-for-full-screen");
    let imgMajorCard = informAboutProject[dataValue].children[1].cloneNode(true);
    let lastChild = informAboutProject[dataValue].lastElementChild.cloneNode(true);
    let fullScreenElement = document.querySelector(".information-about-project__major-content_full-screen");
    fullScreenElement.setAttribute("data-value", dataValue);

    imgForFullScreen.appendChild(imgMajorCard);
    fullScreenElement.appendChild(lastChild);
}