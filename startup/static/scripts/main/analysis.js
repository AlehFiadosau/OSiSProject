let analysis = document.querySelector(".analysis");
let executeAnalysis = document.querySelector(".execute-analysis");

function dataAnalysis() {
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

    ajaxQueryCalback("GET", "/calcAnalysis/", ".execute-analysis", ".analysis", dataDictionary, ".analysis-result");
}