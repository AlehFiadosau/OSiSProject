function drawSurface() {
    let filePaths = document.querySelectorAll(".file-for-surface input");
    let resultId = "#draw-result__failed";

    if (filePaths.length < 3 || filePaths === null) {
        dataDictionary = {
            Error: "Указаны не все данные",
        };
    } else {
        dataDictionary = {
            XPath: filePaths[0].value,
            YPath: filePaths[1].value,
            ZPath: filePaths[2].value,
        };

        resultId = "#draw-result__successed";
    }

    callbackAjax.complete.func = addSurface;
    callbackAjax.complete.params = [];

    ajaxQueryCalback("GET", "/getDataForSurface/", "#draw-surface-load", "#draw-surface", dataDictionary, resultId, callbackAjax);
}

function addSurface() {
    let surf = document.querySelector(".img-surface");
    let src = "/static/surfaces/surface.png";
    let img = createImg(src);

    if (surf.children.length == 1) {
        surf.children[0].remove();
    }

    surf.appendChild(img);
}