let cardMinors = document.querySelectorAll(".information-about-project__minor-content .card");
let queueNumber = 1;

function calcSurfaceSquare(oneProgress) {
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
    let isShowApprox = document.querySelector("#id_IsShowIntegral");
    let filesArray = [];
    let execute;
    
    if (isSaveFile.checked) {
        let XFile = document.querySelector("#id_XFile");
        let YFile = document.querySelector("#id_YFile");
        let ZFile = document.querySelector("#id_ZFile");
        let dir = "Output/";
        let fileExt = ".csv";
        
        let paramsHints = document.querySelectorAll(".hint-for-params");
        let paramsWarning = document.querySelector("#default-params");
        checkDefaultData(paramsHints, paramsWarning, A, B, C, D);

        paramsHints = document.querySelectorAll(".hint-for-intervals");
        paramsWarning = document.querySelector("#default-intervals");
        checkDefaultData(paramsHints, paramsWarning, Xs, Xf, Ys, Yf);
        
        paramsHints = document.querySelectorAll(".hint-for-processes");
        paramsWarning = document.querySelector("#default-processes");
        checkDefaultData(paramsHints, paramsWarning, N, Proc);

        let allWarningForIntervals = document.querySelectorAll(".interval__warning");

        for (let index = 0; index < allWarningForIntervals.length; index++) {
            allWarningForIntervals[index].setAttribute("hidden", true);
        }

        let targetWarningForIntervals = document.querySelector(".for-x");
        paramsHints = document.querySelectorAll(".hint-for-intervals");
        checkIntervalsValue(Xs, Xf, targetWarningForIntervals, paramsHints);

        targetWarningForIntervals = document.querySelector(".for-y");
        checkIntervalsValue(Ys, Yf, targetWarningForIntervals, paramsHints);

        checkDefaultFiles(XFile, YFile, ZFile);

        filesArray.push(dir + XFile.value + fileExt);
        filesArray.push(dir + YFile.value + fileExt);
        filesArray.push(dir + ZFile.value + fileExt);
    }

   let  dataDictionary = {
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
        SaveFile: isSaveFile.checked,
        ShowApprox: isShowApprox.checked,
        Files: filesArray
    };

    execute = queueCalc();
    cardExecute(execute.cardNumbers, dataDictionary, execute.callbackAjax);

    let progress = document.querySelector(".progress div");
    currentProgress += oneProgress;

    progress.setAttribute("style", `width: ${currentProgress}%`);
    progress.value = currentProgress;

    showWarningCalc();
}

function checkDefaultFiles(xFile, yFile, zFile) {
    if (xFile.value.length == 0) {
        XFile.value = "xArray";
    }
    if (yFile.value.length == 0) {
        YFile.value = "yArray";
    }
    if (zFile.value.length == 0) {
        ZFile.value = "zArray";
    }
}

function setDefaultData(data, hint, warning) {
    data.value = 1;
    hint.innerHTML = data.value;
    hint.classList.remove("badge-dark");
    hint.classList.add("badge-warning");

    if (warning != null) {
        warning.removeAttribute("hidden");
    }
}

function removeDefaultData(hint) {
    hint.classList.remove("badge-warning");
    hint.classList.add("badge-dark");
}

function showCard(target) {
    let calcQueueCard = target.parentNode;
    let parent = calcQueueCard.parentNode;
    let result = parent.lastElementChild;
    let showIcon = result.previousElementSibling;
    let showIconImg = document.querySelector(`.${showIcon.classList[0]} img`);
    let cardMinor = document.querySelector(`#${result.id} .card-minor`);
    let cardMinorParent = cardMinor.parentNode;

    if (cardMinorParent.getAttribute("hidden") != null) {
        cardMinorParent.removeAttribute("hidden");
        changeImg(showIconImg, "/static/img/icons/icons8-7-32.png");
    } else {
        cardMinorParent.setAttribute("hidden", true);
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

function queueCalc() {
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
    button.innerText = "Вычисление...";

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
    button.innerText = "Вычисление завершено";

    calcQueueCardElements[cardNumbers - 1].appendChild(button);

    callbackAjax.beforeSend.func = beforeAjaxCalculation;
    callbackAjax.complete.func = afterAjaxCalculation;
    callbackAjax.complete.params = params;
    queueNumber++;

    return {
        cardNumbers: cardNumbers - 1,
        callbackAjax: callbackAjax
    }
}

function cardExecute(cardNumbers, dataDictionary, callbackAjax) {
    ajaxQueryCalback("GET", "/calcSquare/", `#load-element-${cardNumbers}`,
        `#complete-element-${cardNumbers}`, dataDictionary, `#result-${cardNumbers}`, callbackAjax);
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

function afterAjaxCalculation() {
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
            createExecuteNumber(index + 1);
            break;
        }
    }
}

function beforeAjaxCalculation() {
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

function fixCalculation(target) {
    let parent = target.parentNode;
    let dataForCalculation = document.querySelector("#data-for-calculation");

    if (dataForCalculation.children.length == 2) {
        dataForCalculation.lastElementChild.remove();
    }

    let parentClone = parent.cloneNode(true);

    let attrNames = ["data-content"];
    let attrVal = ["delete-fix-calc"];
    let src = "/static/img/icons/icons8-10-32.png";
    let img = createImg(src, attrNames, attrVal);

    parentClone.classList.remove("flex-column__flex-end");
    parentClone.classList.add("flex-column__flex-start");
    parentClone.setAttribute("style", "flex-grow: 1;");
    parentClone.firstElementChild.remove();

    let firstChild = parentClone.firstElementChild;
    firstChild.before(img);

    dataForCalculation.appendChild(parentClone);
}