let dataDictionary = {};
let cardMinors = document.querySelectorAll(".information-about-project__minor-content .card");
let cardMajors = document.querySelectorAll(".information-about-project__major-content");

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

            dataDictionary = {
                A: +A.value,
                B: +B.value,
                C: +C.value,
                D: +D.value,
                Xs: +Xs.value,
                Xf: +Xf.value,
                Ys: +Ys.value,
                Yf: +Yf.value,
                N: +N.value
            };

            ajaxQueryComplete("GET", "/calcSquare/", "#load-element", "#complete-element", dataDictionary, "#result");
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
            let fullScreenCardElement = document.querySelector(".full-screen-card");

            if (fullScreenCardElement.children[0] != undefined) {
                fullScreenCardElement.classList.remove("active");
                fullScreenCardElement.removeChild(fullScreenCardElement.children[0]);
                cardMajors[+dataValue].classList.add("active");
            } else {
                ajaxQuery("GET", "/fullScreenCard/", undefined, undefined, ".full-screen-card");
                cardMajors[+dataValue].classList.remove("active");
                fullScreenCardElement.classList.add("active");
            }
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
    }
});

carsMinorsEvents(cardMinors);

function carsMinorsEvents(cardMinors) {
    for (let index = 0; index < cardMinors.length; index++) {
        cardMinors[index].addEventListener("click", () => {
            let dataValue = cardMinors[index].getAttribute("data-value");
            let content = document.querySelectorAll(".information-about-project__major-content");
            changeClass(cardMinors, +dataValue, "bg-info", "bg-dark")
            removeClass(content, "active");
            content[+dataValue].classList.add("active");
        })
    }
}

function changeClass(content, contentNumber, targetClass, otherClass) {
    removeClass(content, otherClass);
    removeClass(content, targetClass);

    for (let index = 0; index < content.length; index++) {
        if (index != contentNumber) {
            content[index].classList.add(otherClass);
        }
    }

    content[contentNumber].classList.add(targetClass);
}

function removeClass(content, className) {
    for (let index = 0; index < content.length; index++) {
        if (content[index].classList.contains(className)) {
            content[index].classList.remove(className);
        }
    }
}

function ajaxQuery(ajaxType, ajaxUrl, loadElement, dataDictionary, resultId) {
    $.ajax({
        type: ajaxType,
        url: ajaxUrl,
        beforeSend: () => {
            $(loadElement).show();
        },
        complete: () => {
            $(loadElement).hide();
        },
        onBegin: "ajaxBegin",
        data: dataDictionary,
        success: (data) => {
            $(resultId).html(data);
        }
    });
}

function ajaxQueryComplete(ajaxType, ajaxUrl, loadElement, completeElement, dataDictionary, resultId) {
    $.ajax({
        type: ajaxType,
        url: ajaxUrl,
        beforeSend: () => {
            $(loadElement).show();
            $(completeElement).hide();
        },
        complete: () => {
            $(loadElement).hide();
            $(completeElement).show();
        },
        onBegin: "ajaxBegin",
        data: dataDictionary,
        success: (data) => {
            $(resultId).html(data);
        }
    });
}