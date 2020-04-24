let dataDictionary = {};
let cardMinors = document.querySelectorAll(".information-about-project__minor-content .card");
let cardMajors = document.querySelectorAll(".information-about-project__major-content");
let progressBar = document.querySelector(".progress div");
let currentProgress = 0;
let oneProgress = 20;
let isMaxCards = false;
let callbackAjax = {
    beforeSend: {
        func: undefined,
        params: []
    },
    complete: {
        func: undefined,
        params: []
    }
};

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
                Proc: +Proc.value
            };

            queueCalc(dataDictionary);
            let progress = document.querySelector(".progress div");
            currentProgress += oneProgress;

            progress.setAttribute("style", `width: ${currentProgress}%`);
            progress.value = currentProgress;
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
        case "show-card":
            let cardMinors = document.querySelectorAll(".card-minor");
            let currentShowIcon = document.querySelectorAll(".show-icon img");

            if (cardMinors[+dataValue].getAttribute("hidden") != null) {
                cardMinors[+dataValue].removeAttribute("hidden");
                changeImg(currentShowIcon[+dataValue], "/static/img/icons/icons8-7-32.png");
            }
            else {
                cardMinors[+dataValue].setAttribute("hidden", true);
                changeImg(currentShowIcon[+dataValue], "/static/img/icons/icons8-6-32.png");
            }
            break;
        case "card-delete":
            let cardQueues = document.querySelectorAll(".calc-queue__list .calc-queue-item");
            
            currentProgress -= oneProgress;
            deleteCard(cardQueues, +dataValue, progressBar, oneProgress);
            break;
        case "cards-clear":
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

function ajaxQueryCalback(ajaxType, ajaxUrl, loadElement, completeElement, dataDictionary, resultId, callback) {
    let beforeSendFunc = callback.beforeSend.func;
    let beforeSendParams = callback.beforeSend.params;
    let completeFunc = callback.complete.func;
    let completeParams = callback.complete.params;

    $.ajax({
        type: ajaxType,
        url: ajaxUrl,
        beforeSend: () => {
            $(loadElement).show();
            $(completeElement).hide();
            if (beforeSendFunc != undefined) {
                beforeSendFunc(beforeSendParams);
            }
        },
        complete: () => {
            $(loadElement).hide();
            $(completeElement).show();
            if (completeFunc != undefined) {
                completeFunc(completeParams);
            }
        },
        onBegin: "ajaxBegin",
        data: dataDictionary,
        success: (data) => {
            $(resultId).html(data);
        }
    });
}

function queueCalc(dataDictionary) {
    let calcQueueCardElements = document.querySelectorAll(".calc-queue__card");
    let listCalcQueue = document.querySelector(".calc-queue__list");
    let cardNumbers = listCalcQueue.children.length;
    let params = [cardNumbers - 1];

    if (cardNumbers < 5) {
        let createCalcQueueCard = document.createElement("li");
        let createDiv = document.createElement("div");
        createDiv.classList.add("calc-queue__card");
        createDiv.innerText = "Пусто";
        createCalcQueueCard.classList.add("calc-queue-item");
        createCalcQueueCard.classList.add("flex-column__center");
        createCalcQueueCard.appendChild(createDiv);
        createDiv = document.createElement("div");
        createDiv.classList.add("results");
        createDiv.id = `result-${cardNumbers}`;
        createCalcQueueCard.appendChild(createDiv);
        listCalcQueue.appendChild(createCalcQueueCard);
    }

    let loadElement = `<button id="load-element-${cardNumbers - 1}" class="load-element btn btn-info">` +
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" disabled>' +
        '</span>Вычисление...</button>';
    let completeElement = `<button id="complete-element-${cardNumbers - 1}" class="complete-element btn btn-success" data-content="show-card"` +
        `data-value="${cardNumbers - 1}" style="display: none;">Вычисление завершено</button>`;
    calcQueueCardElements[cardNumbers - 1].innerHTML = loadElement;
    calcQueueCardElements[cardNumbers - 1].innerHTML += completeElement;

    callbackAjax.beforeSend.func = beforeSendAjax;
    callbackAjax.complete.func = afterCompleteAjax;
    callbackAjax.complete.params = params;

    ajaxQueryCalback("GET", "/calcSquare/", `#load-element-${cardNumbers - 1}`,
        `#complete-element-${cardNumbers - 1}`, dataDictionary, `#result-${cardNumbers - 1}`, callbackAjax);
}

function addDeleteIcon(cardElement, number) {
    let createDiv = document.createElement("div");
    createDiv.classList.add("delete-icon");

    let attrNames = ["data-content", "data-value"];
    let attrVal = ["card-delete", number];
    let src = "/static/img/icons/icons8-2-32.png";
    let img = createImg(src, attrNames, attrVal);

    createDiv.appendChild(img);

    cardElement.prepend(createDiv);
}

function addShowIcon(cardElement) {
    let createDiv = document.createElement("div");
    createDiv.classList.add("show-icon");
    createDiv.classList.add("flex-row__flex-end");
    createDiv.setAttribute("style", "margin-bottom: 0.5vw;");

    let src = "/static/img/icons/icons8-6-32.png";
    let img = createImg(src);

    createDiv.appendChild(img);

    cardElement.before(createDiv);
}

function addClearIcon() {
    let clearElement = document.querySelector("#clear");

    let attrNames = ["data-content"];
    let attrVal = ["cards-clear"];
    let img = createImg("/static/img/icons/icons8-5-32.png", attrNames, attrVal);
    let isShow = false;

    if ($('.load-element').is(':visible')) {
        isShow = true;
    }

    if (!isShow) {
        clearElement.appendChild(img);
    }
}

function removeClearIcon() {
    let clearElement = document.querySelector("#clear img");

    if (clearElement != null) {
        clearElement.remove();
    }
}

function changeImg(img, newSrc) {
    img.src = newSrc;
}

function deleteCard(cardQueues, number, progress, oneProgress) {
    cardQueues[number].remove();

    let completeElements = document.querySelectorAll(".complete-element");
    let deleteIcons = document.querySelectorAll(".delete-icon img");
    let loadElements = document.querySelectorAll(".load-element");
    let resultElements = document.querySelectorAll(".results");

    for (let index = 0; index < deleteIcons.length; index++) {
        deleteIcons[index].setAttribute("data-value", index);
        completeElements[index].setAttribute("data-value", index);
        completeElements[index].id = `complete-element-${index}`;
        loadElements[index].id = `load-element-${index}`;
        resultElements[index].id = `result-${index}`;
    }

    let currentProgress = getProgressData(progress);

    progress.setAttribute("style", `width: ${currentProgress - oneProgress}%`);
    progress.value = currentProgress;

    addEmpthCard();
}

function afterCompleteAjax() {
    let params = arguments;
    let calcQueueElements = document.querySelectorAll(".calc-queue-item");
    let lastChild = calcQueueElements[params[0]].lastElementChild;

    addDeleteIcon(calcQueueElements[params[0]], params[0]);
    addShowIcon(lastChild);
    addClearIcon();
}

function beforeSendAjax() {
    removeClearIcon();
}

function addEmpthCard() {
    let listQueueElements = document.querySelector(".calc-queue__list");

    let createLi = document.createElement("li");
    let createDiv = document.createElement("div");
    createLi.classList.add("calc-queue-item");
    createLi.classList.add("flex-column__center");
    createDiv.classList.add("calc-queue__card");
    createDiv.innerText = "Пусто";
    createLi.appendChild(createDiv);
    createDiv = document.createElement("div");
    createDiv.classList.add("results");
    createDiv.id = `result-${listQueueElements.children.length}`;
    createLi.appendChild(createDiv);

    listQueueElements.appendChild(createLi);
}

function cardsClear(progress) {
    let listCardQueues = document.querySelector(".calc-queue__list");

    progress.setAttribute("style", 'width: 0');
    progress.value = 0;

    while (listCardQueues.firstChild) {
        listCardQueues.removeChild(listCardQueues.firstChild);
    }

    addEmpthCard();
    removeClearIcon();
}

function getProgressData(progress, ) {
    let currentProgressElement = progress.getAttribute("style");
    let parseProgress = currentProgressElement.split(':')[1];
    let currentProgress = parseProgress.substring(0, parseProgress.length - 1);

    return currentProgress;
}

function createImg(src, attributeNames, attributeValues, classList, id) {
    let createImg = document.createElement("img");
    createImg.src = src;

    for (let index = 0; attributeNames != undefined && index < attributeNames.length; index++) {
        createImg.setAttribute(attributeNames[index], attributeValues[index]);
    }

    for (let index = 0; classList != undefined && index < classList.length; index++) {
        createImg.classList.add(classList[index]);
    }

    if (id != undefined) {
        createImg.id = id;
    }

    return createImg;
}