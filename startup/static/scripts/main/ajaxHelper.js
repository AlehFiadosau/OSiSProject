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
    let beforeSendFunc, beforeSendParams, completeFunc, completeParams;

    if (callback != undefined) {
        beforeSendFunc = callback.beforeSend.func;
        beforeSendParams = callback.beforeSend.params;
        completeFunc = callback.complete.func;
        completeParams = callback.complete.params;
    }

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