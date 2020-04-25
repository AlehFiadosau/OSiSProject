let cardMinors = document.querySelectorAll(".information-about-project__minor-content .card");
let queueNumber = 1;
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

function showCard(target) {
    let calcQueueCard = target.parentNode;
    let parent = calcQueueCard.parentNode;
    let result = parent.lastElementChild;
    let showIcon = result.previousElementSibling;
    let showIconImg = document.querySelector(`.${showIcon.classList[0]} img`);
    let cardMinor = document.querySelector(`#${result.id} .card-minor`);

    if (cardMinor.getAttribute("hidden") != null) {
        cardMinor.removeAttribute("hidden");
        changeImg(showIconImg, "/static/img/icons/icons8-7-32.png");
    } else {
        cardMinor.setAttribute("hidden", true);
        changeImg(showIconImg, "/static/img/icons/icons8-6-32.png");
    }
}

cardsMinorsEvents(cardMinors);

function cardsMinorsEvents(cardMinors) {
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

function queueCalc(dataDictionary) {
    let calcQueueCardElements = document.querySelectorAll(".calc-queue__card");
    let listCalcQueue = document.querySelector(".calc-queue__list");
    let cardNumbers = listCalcQueue.children.length;
    let params = [queueNumber - 1];

    if (cardNumbers < 5) {
        let createCalcQueueCard = document.createElement("li");
        let createDiv = document.createElement("div");
        createDiv.classList.add("calc-queue__card");
        createDiv.setAttribute("data-execute", queueNumber);
        createDiv.innerText = "Пусто";
        createCalcQueueCard.setAttribute("data-queue", queueNumber);
        createCalcQueueCard.classList.add("calc-queue-item");
        createCalcQueueCard.classList.add("flex-column__center");
        createCalcQueueCard.appendChild(createDiv);
        createDiv = document.createElement("div");
        createDiv.classList.add("results");
        createDiv.id = `result-${cardNumbers}`;
        createCalcQueueCard.appendChild(createDiv);
        listCalcQueue.appendChild(createCalcQueueCard);
    }

    let classList = ["load-element", "btn", "btn-info"];
    let id = `load-element-${cardNumbers - 1}`;
    let button = createButton(classList, id);
    button.innerText = "Вычисление..."

    classList = ["spinner-border", "spinner-border-sm"];
    let attributeNames = ["role", "aria-hidden"];
    let attributeValues = ["status", true];
    let span = createSpan(classList, attributeNames, attributeValues);;
    button.appendChild(span);

    calcQueueCardElements[cardNumbers - 1].innerText = "";
    calcQueueCardElements[cardNumbers - 1].appendChild(button);

    classList = ["complete-element", "btn", "btn-success"];
    id = `complete-element-${cardNumbers - 1}`;
    attributeNames = ["data-content", "data-value", "style"];
    attributeValues = ["show-card", cardNumbers - 1, "display: none;"];
    button = createButton(classList, id, attributeNames, attributeValues);
    button.innerText = "Вычисление завершено"

    calcQueueCardElements[cardNumbers - 1].appendChild(button);

    callbackAjax.beforeSend.func = beforeSendAjax;
    callbackAjax.complete.func = afterCompleteAjax;
    callbackAjax.complete.params = params;
    queueNumber++;

    ajaxQueryCalback("GET", "/calcSquare/", `#load-element-${cardNumbers - 1}`,
        `#complete-element-${cardNumbers - 1}`, dataDictionary, `#result-${cardNumbers - 1}`, callbackAjax);
}

function createButton(classList, id, attributeNames, attributeValues) {
    let button = document.createElement("button");

    if (id != undefined) {
        button.id = id;
    }

    if (attributeNames != undefined) {
        for (let index = 0; index < attributeNames.length; index++) {
            button.setAttribute(attributeNames[index], attributeValues[index]);
        }
    }

    for (let index = 0; index < classList.length; index++) {
        button.classList.add(classList[index]);
    }

    return button;
}

function createSpan(classList, attributeNames, attributeValues, id) {
    let span = document.createElement("span");

    if (id != undefined) {
        span.id = id;
    }

    for (let index = 0; index < classList.length; index++) {
        span.classList.add(classList[index]);
    }

    if (attributeNames != undefined) {
        for (let index = 0; index < attributeNames.length; index++) {
            span.setAttribute(attributeNames[index], attributeValues[index]);
        }
    }

    return span;
}

function createDeleteIcon(cardElement, number) {
    let createDiv = document.createElement("div");
    createDiv.classList.add("delete-icon");

    let attrNames = ["data-content", "data-value"];
    let attrVal = ["card-delete", number];
    let src = "/static/img/icons/icons8-2-32.png";
    let img = createImg(src, attrNames, attrVal);

    createDiv.appendChild(img);

    cardElement.prepend(createDiv);
}

function createShowIcon(cardElement) {
    let createDiv = document.createElement("div");
    createDiv.classList.add("show-icon");
    createDiv.classList.add("flex-row__flex-end");
    createDiv.setAttribute("style", "margin-bottom: 0.5vw;");

    let src = "/static/img/icons/icons8-6-32.png";
    let img = createImg(src);

    createDiv.appendChild(img);

    cardElement.before(createDiv);
}

function createExecuteNumber(number) {
    let orderExecute = document.querySelector(".order-execution");
    let classList = ["badge", "badge-dark", "hint-for-params"];
    let span = createSpan(classList);
    span.innerText = number;

    orderExecute.appendChild(span);
}

function createClearIcon() {
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

function createEmpthCard() {
    let listQueueElements = document.querySelector(".calc-queue__list");

    let createLi = document.createElement("li");
    let createDiv = document.createElement("div");
    createLi.setAttribute("data-queue", queueNumber);
    createLi.classList.add("calc-queue-item");
    createLi.classList.add("flex-column__center");
    createDiv.classList.add("calc-queue__card");
    createDiv.setAttribute("data-execute", queueNumber);
    createDiv.innerText = "Пусто";
    createLi.appendChild(createDiv);
    createDiv = document.createElement("div");
    createDiv.classList.add("results");
    createDiv.id = `result-${listQueueElements.children.length}`;
    createLi.appendChild(createDiv);

    queueNumber++;
    listQueueElements.appendChild(createLi);
}

function createImg(src, attributeNames, attributeValues, classList, id) {
    let createImg = document.createElement("img");
    createImg.src = src;

    if (attributeNames != undefined) {
        for (let index = 0; index < attributeNames.length; index++) {
            createImg.setAttribute(attributeNames[index], attributeValues[index]);
        }
    }

    if (classList != undefined) {
        for (let index = 0; index < classList.length; index++) {
            createImg.classList.add(classList[index]);
        }
    }

    if (id != undefined) {
        createImg.id = id;
    }

    return createImg;
}

function changeImg(img, newSrc) {
    img.src = newSrc;
}

function deleteClearIcon() {
    let clearElement = document.querySelector("#clear img");

    if (clearElement != null) {
        clearElement.remove();
    }
}

function deleteCard(cardQueues, number, progress, oneProgress) {
    let completeElements = document.querySelectorAll(".complete-element");
    let calcQueue = completeElements[number].parentNode;
    let executeNumber = +calcQueue.getAttribute("data-execute");

    deleteExecuteNumber(executeNumber);
    cardQueues[number].remove();
    showWarningCalc();

    let deleteIcons = document.querySelectorAll(".delete-icon img");
    let loadElements = document.querySelectorAll(".load-element");
    let resultElements = document.querySelectorAll(".results");
    completeElements = document.querySelectorAll(".complete-element");

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

    if (loadElements.length == 4) {
        createEmpthCard();
    }

    // let calcQueue = completeElements[number].parentNode;
    // let executeNumber = +calcQueue.getAttribute("data-execute");
    // deleteExecuteNumber(executeNumber);

    // cardQueues[number].remove();
    // showWarningCalc();
}

function deleteExecuteNumber(number) {
    let orderExecution = document.querySelector(".order-execution");
    let content = "";

    for (let index = 1; index < orderExecution.children.length; index++) {
        content = orderExecution.children[index].innerText;
        if (+content == number + 1) {
            orderExecution.children[index].remove();
            break;
        }
    }
}

function afterCompleteAjax() {
    let params = arguments;
    let calcQueueElements = document.querySelectorAll(".calc-queue-item");
    let lastChild;
    let queuAttribute;

    for (let index = 0; index < calcQueueElements.length; index++) {
        queuAttribute = +calcQueueElements[index].getAttribute("data-queue");

        if (queuAttribute == params[0]) {
            lastChild = calcQueueElements[index].lastElementChild;

            createDeleteIcon(calcQueueElements[index], index);
            createShowIcon(lastChild);
            createClearIcon();
            createExecuteNumber(index+ 1);
            break;
        }
    }

    // createDeleteIcon(calcQueueElements[params[0]], params[0]);
    // createShowIcon(lastChild);
    // createClearIcon();
    // createExecuteNumber(+params[0] + 1);
}

function beforeSendAjax() {
    deleteClearIcon();
}

function cardsClear(progress) {
    let listCardQueues = document.querySelector(".calc-queue__list");
    let count = 0;

    progress.setAttribute("style", 'width: 0');
    progress.value = 0;

    while (listCardQueues.firstChild) {
        deleteExecuteNumber(count);
        listCardQueues.removeChild(listCardQueues.firstChild);
        count++;
    }

    createEmpthCard();
    deleteClearIcon();
    showWarningCalc();
}

function getProgressData(progress, ) {
    let currentProgressElement = progress.getAttribute("style");
    let parseProgress = currentProgressElement.split(':')[1];
    let currentProgress = parseProgress.substring(0, parseProgress.length - 1);

    return currentProgress;
}

function showWarningCalc() {
    let loadElements = document.querySelectorAll(".load-element");
    let calcSurfaceSquareInput = document.querySelector(".calc-surface-square input");
    let calcSurfaceSquareIcon = document.querySelector(".calc-surface-square img");

    if (loadElements.length == 5) {
        calcSurfaceSquareInput.setAttribute("disabled", true);
        calcSurfaceSquareIcon.removeAttribute("hidden");
    } else {
        calcSurfaceSquareInput.removeAttribute("disabled");
        calcSurfaceSquareIcon.setAttribute("hidden", true);
    }
}