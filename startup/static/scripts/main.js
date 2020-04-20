let dataDictionary = {}

document.addEventListener("click", (ev) => {
    let dataContent = ev.target.getAttribute("data-content");

    switch(dataContent) {
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

            ajaxQuery("GET", "/calcSquare/", "#load-element", dataDictionary, "#result");
            break;
        case "get-file":
            let dataValue = ev.target.getAttribute("data-value");
            ajaxQuery("GET", "/getFile/", undefined, undefined, `#file-for-surface-${dataValue}`);
            break;
        case "draw":
            let filePaths = document.querySelectorAll(".file-for-surface input");
            if (filePaths.length < 3 || filePaths === null) {
                dataDictionary = {
                    Error: "Указаны не все данные",
                };

                ajaxQuery("GET", "/getDataForSurface/", "#draw-load", dataDictionary, "#draw-result__failed");
            }
            else {
                dataDictionary = {
                    XPath: filePaths[0].value,
                    YPath: filePaths[1].value,
                    ZPath: filePaths[2].value,
                };

                ajaxQuery("GET", "/getDataForSurface/", "#draw-load", dataDictionary, "#draw-result__successed");
            }
            break;
        case "nav":
            let navbarActive = document.querySelector(".navbar-nav .active");
            navbarActive.classList.remove("active");
            console.log(navbarActive);
            break;
    }
});

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