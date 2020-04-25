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
            let A = document.querySelector("#id_A");
            let B = document.querySelector("#id_B");
            let C = document.querySelector("#id_C");
            let D = document.querySelector("#id_D");
            let Xs = document.querySelector("#id_Xs");
            let Xf = document.querySelector("#id_Xf");
            let Ys = document.querySelector("#id_Ys");
            let Yf = document.querySelector("#id_Yf");
            let N = document.querySelector("#id_N");
            let Proc = document.querySelector("#id_Proc");
            let isSaveFile = document.querySelector("#id_IsSaveFile");
            let filesArray = [];

            if (isSaveFile.checked) {
                let XFile = document.querySelector("#id_XFile");
                let YFile = document.querySelector("#id_YFile");
                let ZFile = document.querySelector("#id_ZFile");
                let dir = "Output/";
                let fileExt = ".csv";

                filesArray.push(dir + XFile.value + fileExt);
                filesArray.push(dir + YFile.value + fileExt);
                filesArray.push(dir + ZFile.value + fileExt);
            }

            dataDictionary = {
                A: +A.value,
                B: +B.value,
                C: +C.value,
                D: +D.value,
                Xs: +Xs.value,
                Xf: +Xf.value,
                Ys: +Ys.value,
                Yf: +Yf.value,
                N: +N.value,
                Proc: +Proc.value,
                isSaveFile: isSaveFile.checked,
                Files: filesArray
            };

            queueCalc(dataDictionary);
            let progress = document.querySelector(".progress div");
            currentProgress += oneProgress;

            progress.setAttribute("style", `width: ${currentProgress}%`);
            progress.value = currentProgress;

            showWarningCalc();
            break;
        case "get-file":
            ajaxQuery("GET", "/getFile/", undefined, undefined, `#file-for-surface-${dataValue}`);
            break;
        case "draw":
            let filePaths = document.querySelectorAll(".file-for-surface input");
            if (filePaths.length < 3 || filePaths === null) {
                dataDictionary = {
                    Error: "Указаны не все данные",
                };

                ajaxQuery("GET", "/getDataForSurface/", "#draw-load", dataDictionary, "#draw-result__failed");
            } else {
                dataDictionary = {
                    XPath: filePaths[0].value,
                    YPath: filePaths[1].value,
                    ZPath: filePaths[2].value,
                };

                ajaxQuery("GET", "/getDataForSurface/", "#draw-load", dataDictionary, "#draw-result__successed");
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