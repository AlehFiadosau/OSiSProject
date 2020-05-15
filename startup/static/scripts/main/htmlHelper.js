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

function changeImg(img, newSrc) {
    img.src = newSrc;
}

function checkDefaultData(hints, showWarning) {
    if (showWarning != null) {
        showWarning.setAttribute("hidden", true);
    }
    
    if (arguments.length > 2)
    {
        for (let index = 2; index < arguments.length; index++) {
            if (arguments[index].value.length == 0) {
                setDefaultData(arguments[index], hints[index - 2], showWarning);
            } else {
                removeDefaultData(hints[index - 2]);
            }
        }
    }
}

function checkIntervalsValue(startElement, finishElement, taregtWarning, hints) {
    let dataValue = +startElement.getAttribute("data-value");

    if (startElement.value > finishElement.value) {
        taregtWarning.removeAttribute("hidden");
        hints[dataValue].classList.remove("badge-dark");
        hints[dataValue].classList.add("badge-danger");
    }
}