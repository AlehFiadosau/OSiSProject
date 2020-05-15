let surfaceError = false;

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
    callbackAjax.error.func = surfError;
    callbackAjax.error.params = [];

    ajaxQueryCalbackE("GET", "/getDataForSurface/", "#draw-surface-load", "#draw-surface", dataDictionary, resultId, callbackAjax);
}

function addSurface() {
    if (!surfaceError) {
        let surf = document.querySelector(".img-surface");
        let src = "/static/surfaces/surface.png";
        let img = createImg(src);

        if (surf.children.length == 1) {
            surf.children[0].remove();
        }

        surf.appendChild(img);
    }
}

function surfError() {
    surfaceError = true;
    let surf = document.querySelector(".img-surface");
    let firstChild = surf.firstElementChild;
    surf.removeChild(firstChild);
}