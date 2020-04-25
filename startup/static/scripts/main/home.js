function fullScreen(dataValue) {
    let fullScreenCardElement = document.querySelector(".full-screen-card");

    if (fullScreenCardElement.children[0] != undefined) {
        fullScreenCardElement.classList.remove("active");
        fullScreenCardElement.removeChild(fullScreenCardElement.children[0]);
        cardMajors[dataValue].classList.add("active");
    } else {
        
        ajaxQuery("GET", "/fullScreenCard/", undefined, undefined, ".full-screen-card");

        cardMajors[dataValue].classList.remove("active");
        fullScreenCardElement.classList.add("active");
    }
}