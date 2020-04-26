from django.shortcuts import render
from django.http import HttpResponse
import tkinter as tk
from tkinter.filedialog import askopenfilename
from .businessLayer.trapezoidMethod import TrapezoidMethod
from .businessLayer.fileHelper import FileHelperForTrapezoid
from .businessLayer.models.analysisModel import AnalysisModel
from multiprocessing import Pool


def home(request):
    return render(request, "home.html")


def surface(request):
    return render(request, "surface.html")


def getFile(request):
    root = tk.Tk()
    root.withdraw()
    path = askopenfilename(defaultextension='.csv',
                           initialdir="./Output/",
                           filetypes=[('CSV files', '*.csv')])
    root.destroy()
    fileName = path.split("/").pop()
    html = """
        <input type='hidden' value="{0}"/>
        <div class="path">{1}</div>
    """

    return HttpResponse(html.format(path, fileName))


def getDataForSurface(request):
    error = request.GET.get("Error", "")
    if (error == ""):
        xpath = request.GET.get("XPath", "")
        ypath = request.GET.get("YPath", "")
        zpath = request.GET.get("ZPath", "")
        fileHelper = FileHelperForTrapezoid()
        x, y, z = fileHelper.readOfFiles(xpath, ypath, zpath)

        trapezoid = TrapezoidMethod()
        trapezoid.draw(x, y, z)

        return HttpResponse("Построение завершено")
    else:
        return HttpResponse(error)


def calculation(request):
    return render(request, "calculation.html")


def analysis(request):
    return render(request, "analysis.html")


def calcAnalysis(request):
    a = int(request.GET.get("A", 1))
    b = int(request.GET.get("B", 1))
    c = int(request.GET.get("C", 1))
    d = int(request.GET.get("D", 1))
    xs = int(request.GET.get("Xs", 1))
    xf = int(request.GET.get("Xf", 1))
    ys = int(request.GET.get("Ys", 1))
    yf = int(request.GET.get("Yf", 1))
    n = int(request.GET.get("N", 1))
    procNum = int(request.GET.get("Proc", 1))

    results, executeTimes = __calcAnalysis__(
        a, b, c, d, xs, xf, ys, yf, n, procNum)

    analysisData = []

    for index in range(len(results)):
        analysisModel = AnalysisModel()
        analysisModel.Result = results[index]
        analysisModel.ExecuteTime = executeTimes[index]
        analysisModel.ProcessesNumber = index + 1

        analysisData.append(analysisModel)

    return render(request, "analysis/calcAnalysis.html", {"Results": analysisData})


def calcSquare(request):
    a = int(request.GET.get("A", 1))
    b = int(request.GET.get("B", 1))
    c = int(request.GET.get("C", 1))
    d = int(request.GET.get("D", 1))
    xs = int(request.GET.get("Xs", 1))
    xf = int(request.GET.get("Xf", 1))
    ys = int(request.GET.get("Ys", 1))
    yf = int(request.GET.get("Yf", 1))
    n = int(request.GET.get("N", 1))
    procNum = int(request.GET.get("Proc", 1))
    isSaveFile = bool(request.GET.get("isSaveFile", False))

    result, executeTime, z = __calcTrapezoid__(
        a, b, c, d, xs, xf, ys, yf, n, procNum)

    if (isSaveFile):
        __writeFile__(xs, xf, ys, yf, z, request)

    return render(request, "calculation/calcSquare.html", {"Result": result, "ExecuteTime": executeTime, "ProcNum": procNum})


def fullScreenCard(request):
    return render(request, "home/fullScreenCard.html")


def __calcTrapezoid__(a, b, c, d, xs, xf, ys, yf, n, procNum):
    trapezoid = TrapezoidMethod()
    trapezoid.setParams(a, b, c, d)
    trapezoid.setIntervals(xs, xf, ys, yf)
    result, executeTime = trapezoid.execute(n, procNum)
    z = trapezoid.getMatrix()

    return [result, executeTime, z]


def __calcAnalysis__(a, b, c, d, xs, xf, ys, yf, n, procNum):
    trapezoid = TrapezoidMethod()
    trapezoid.setParams(a, b, c, d)
    trapezoid.setIntervals(xs, xf, ys, yf)
    results, executeTimes = trapezoid.executeAnalysis(n, procNum)

    return [results, executeTimes]


def __writeFile__(xs, xf, ys, yf, z, request):
    xFile, yFile, zFile = request.GET.getlist("Files[]", [])

    fileHelper = FileHelperForTrapezoid()
    fileHelper.setParams(xs, xf, ys, yf)
    fileHelper.setMatrix(z)
    fileHelper.writeToFiles(xFile, yFile, zFile)
