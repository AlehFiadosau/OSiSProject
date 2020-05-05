import math
import csv


class FileHelperForTrapezoid():
    Xs = 0
    Xf = 0
    Ys = 0
    Yf = 0
    Z = []

    def setParams(self, xs, xf, ys, yf):
        self.Xs = xs
        self.Xf = xf
        self.Ys = ys
        self.Yf = yf

    def setMatrix(self, z):
        self.Z = z

    def writeToFiles(self,
                    xArraysPath="Output/xArray.csv",
                    yArraysPath="Output/yArray.csv",
                    matrixPath="Output/zArray.csv"):
        xs = self.Xs
        xf = self.Xf
        ys = self.Ys
        yf = self.Yf
        z = self.Z
        x = int(math.fabs(xf - xs))
        y = int(math.fabs(yf - ys))
        xArr = []
        yArr = []
        for index in range(x):
            xArr.append(xs + index)
        for index in range(y):
            yArr.append(ys + index)
        with open(xArraysPath, "w", newline='') as csvFile:
            writer = csv.writer(csvFile)
            writer.writerows(map(lambda val: [val], xArr))
        with open(yArraysPath, "w", newline='') as csvFile:
            writer = csv.writer(csvFile)
            writer.writerows(map(lambda val: [val], yArr))
        with open(matrixPath, "w", newline='') as csvFile:
            writer = csv.writer(csvFile)
            for row in range(x):
                writer.writerow(map(lambda val: val, z[row]))

    def writeToFile(self, result, squarePath="Output/square.csv"):
        with open(squarePath, "a", newline='') as csvFile:
            writer = csv.writer(csvFile)
            writer.writerows(map(lambda val: [val], result))

    def readOfFiles(self,
                   xArraysPath="Output/xArray.csv",
                   yArraysPath="Output/yArray.csv",
                   matrixPath="Output/matrix.csv"):
        x = []
        y = []
        z = []

        with open(xArraysPath, "r") as csvFile:
            reader = csv.reader(csvFile)
            for row in reader:
                x.append(int(row[0]))
        with open(yArraysPath, "r") as csvFile:
            reader = csv.reader(csvFile)
            for row in reader:
                y.append(int(row[0]))
        with open(matrixPath, "r") as csvFile:
            reader = csv.reader(csvFile)
            for row in reader:
                z.append([float(item) for item in row])
        
        return [x, y, z]
