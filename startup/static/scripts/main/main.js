let dataDictionary = {};
let cardMajors = document.querySelectorAll(".information-about-project__major-content");
let progressBar = document.querySelector(".progress div");
let saveAs = document.querySelector("#save-as");
let currentProgress = 0;
let oneProgress = 20;
let isMaxCards = false;

document.addEventListener("click", (ev) => {
    let dataContent = ev.target.getAttribute("data-content");
    let dataValue = ev.target.getAttribute("data-value");

    switch (dataContent) {
        case "calc-surface-square":
            calcSurfaceSquare(currentProgress, oneProgress);
            break;
        case "get-file":
            ajaxQuery("GET", "/getFile/", undefined, undefined, `#file-for-surface-${dataValue}`);
            break;
        case "draw":
            drawSurface();
            break;
        case "full-screen":
            fullScreen(+dataValue);
            break;
        case "show-card":
            showCard(ev.target);
            break;
        case "card-delete":
            let cardQueues = document.querySelectorAll(".calc-queue__list .calc-queue-item");
            currentProgress -= oneProgress;
            deleteCard(cardQueues, +dataValue, progressBar, oneProgress);
            break;
        case "cards-clear":
            currentProgress = 0;
            cardsClear(progressBar);
            break;
        case "fix-calculation":
            fixCalculation(ev.target);
            break;
        case "delete-fix-calc":
            let dataForCalculation = document.querySelector("#data-for-calculation");
            dataForCalculation.lastElementChild.remove();
            break;
        case "analysis":
            dataAnalysis();
            break;
    }
});

document.addEventListener("change", (ev) => {
    let dataContent = ev.target.getAttribute("data-content");
    let dataValue = ev.target.getAttribute("data-value");
    let hints;

    switch (dataContent) {
        case "params-for-calc-surface":
            hints = document.querySelectorAll(".hint-for-params");
            hints[+dataValue].innerHTML = ev.target.value;
            break;
        case "intervals-for-calc-surface":
            hints = document.querySelectorAll(".hint-for-intervals");
            hints[+dataValue].innerHTML = ev.target.value;
            break;
        case "processes-for-calc-surface":
            hints = document.querySelectorAll(".hint-for-processes");
            hints[+dataValue].innerHTML = ev.target.value;
            break;
        case "div-for-calc-surface":
            hints = document.querySelectorAll(".hint-for-div");
            hints[+dataValue].innerHTML = ev.target.value;
            break;
        case "save-as":
            if (ev.target.checked) {
                saveAs.removeAttribute("hidden");
            } else {
                saveAs.setAttribute("hidden", true);
            }
            break;
        case "result-save":
            let save = document.querySelector("#id_IsSaveFile");
            let saveAsChecked = document.querySelector("#save-as-checked");

            if (!save.checked) {
                saveAsChecked.setAttribute("disabled", true);
                saveAsChecked.checked = false;
                saveAs.setAttribute("hidden", true);
            } else {
                saveAsChecked.removeAttribute("disabled");
            }
            break;
    }
});