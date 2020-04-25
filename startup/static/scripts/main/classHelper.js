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