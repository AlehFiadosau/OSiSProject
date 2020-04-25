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