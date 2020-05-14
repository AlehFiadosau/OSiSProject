let dataDictionary = {};
let cardMajors = document.querySelectorAll(".information-about-project__major-content");
let progressBar = document.querySelector(".progress div");
let drawSurfaceButton = document.querySelector("#draw-surface");
let saveAs = document.querySelector("#save-as");
let currentProgress = 0;
let oneProgress = 20;
let isMaxCards = false;

document.addEventListener("click", (ev) => {
    let dataContent = ev.target.getAttribute("data-content");
    let dataValue = ev.target.getAttribute("data-value");

    switch (dataContent) {
        case "calc-surface-square":
            calcSurfaceSquare(oneProgress);
            break;
        case "get-file":
            drawSurfaceButton.removeAttribute("disabled");
            ajaxQuery("GET", "/getFile/", undefined, undefined, `#file-for-surface-${dataValue}`);
            break;
        case "draw":
            let isDraw = checkFile();
            if (isDraw) {
                drawSurface();
            }
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
    let warning = [];
    warning.push(document.querySelector("#processes-for-calc-surface__warning"));
    warning.push(document.querySelector("#div-for-calc-surface__warning"));
    
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
            checkProcess(warning, 0, ev.target.value);
            break;
        case "div-for-calc-surface":
            hints = document.querySelectorAll(".hint-for-processes");
            hints[+dataValue].innerHTML = ev.target.value;
            checkProcess(warning, 1, ev.target.value);
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
        case "file-for-date":
            checkSaveAs(ev.target.value, +dataValue);
            break;
    }
});

function checkProcess(warning, warningNumber, number) {
    let button = document.querySelector("#calc-square");
    let imgWarning = document.querySelector(".calc-surface-square img");
    let isEnabled = false;
    let isHidden = true;
    let isFullQueue = false;

    if (number <= 0) {
        warning[warningNumber].removeAttribute("hidden");
        button.setAttribute("disabled", true);
    } else {
        warning[warningNumber].setAttribute("hidden", true);
        isEnabled = true;
    }

    if (imgWarning != undefined) {
        if (!imgWarning.hidden) {
            isFullQueue = true;
        }
    }

    if (isEnabled) {
        for (let index = 0; index < warning.length; index++) {
            if (!warning[index].hidden) {
                isHidden = false;
            }
        }
    }

    if (isEnabled && isHidden && !isFullQueue) {
        button.removeAttribute("disabled");
    }
}

function checkFile() {
    let path = document.querySelectorAll(".path");
    let drawSurface = document.querySelector("#draw-surface");
    let drawWarning = document.querySelectorAll(".draw__warning");
    let isEnabled = true;
    let isDraw = true;

    for (let index = 0; index < path.length; index++) {
        if (path[index].innerHTML.length == 0) {
            isEnabled = false;
            drawWarning[index].removeAttribute("hidden");
        } else {
            drawWarning[index].setAttribute("hidden", true);
        }
    }

    if (!isEnabled) {
        drawSurface.setAttribute("disabled", true);
        isDraw = false;
    }

    return isDraw;
}

function checkSaveAs(val, number) {
    let fileWarning = document.querySelectorAll(".file__warning ");

    if (val.length == 0) {
        fileWarning[number].removeAttribute("hidden");
    } else {
        fileWarning[number].setAttribute("hidden", true);
    }
}