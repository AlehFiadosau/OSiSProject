from datetime import datetime
import numpy as np
import matplotlib.pyplot as plt
import math
import matplotlib
from multiprocessing import Pool
from .fileHelper import FileHelperForTrapezoid
import os.path
matplotlib.use('TkAgg')


class TrapezoidMethod():
    A = 3
    B = 1
    C = 5
    D = -5
    Xs = -50
    Xf = 50
    Ys = -70
    Yf = 70

    def setParams(self, a=3, b=1, c=5, d=-5):
        self.A = a
        self.B = b
        self.C = c
        self.D = d

    def setIntervals(self, xs=-50, xf=50, ys=-70, yf=70):
        self.Xs = xs
        self.Xf = xf
        self.Ys = ys
        self.Yf = yf

    def execute(self, step, processesNumber):
        sum = 0
        currentRes = 0
        dataForWrite = []

        n = (self.Yf - self.Ys) / step
        m = (self.Xf - self.Xs) / step
        h = (self.Yf - self.Ys) / processesNumber
        itersToN = n / processesNumber

        startTime = datetime.now()

        p = Pool(processes=processesNumber)
        for index in range(processesNumber):
            ys = self.Ys + h * index
            yf = self.Ys + h * (index + 1)
            currentRes = p.apply_async(self.calcFromY, (ys, yf, step, int(itersToN), int(m)))
            sum += currentRes.get() * processesNumber
            dataForWrite.append(currentRes.get() * processesNumber)
        result = (sum * step * step) / processesNumber
        p.close()
        p.join()

        executeTime = datetime.now() - startTime

        self.writeFile(dataForWrite)

        return [result, executeTime]

    def executeAnalysis(self, n, processesNumber):
        res = 0
        sum = 0
        allSum = []
        executeTimes = []

        for number in range(processesNumber):
            startTime = datetime.now()
            currentProcessNumber = number + 1

            iters = n / currentProcessNumber
            h = (self.Yf - self.Ys) / currentProcessNumber
            p = Pool(processes=currentProcessNumber)

            for index in range(currentProcessNumber):
                ys = self.Ys + h * index
                yf = self.Ys + h * (index + 1)
                res = p.apply_async(self.calcFromY, (ys, yf, math.ceil(iters)))
                sum += res.get()

            p.close()
            p.join()

            executeTimes.append(datetime.now() - startTime)
            allSum.append(sum)
            sum = 0

        return [allSum, executeTimes]

    def calcFromY(self, ys, yf, step, n, m):
        sum = 0

        if (ys == self.Ys and yf == self.Yf):
            sum = self.targetCalcFromY(ys, yf, step, n, m)
        elif (ys != self.Ys and yf == self.Yf):
            sum = self.targetCalcFromY(ys, yf, step, n, m)
        else:
            sum = self.targetCalcFromY(ys, yf, step, n - 1, m)

        return sum
    
    def targetCalcFromY(self, ys, yf, step, n, m):
        sum = 0
        state = 0

        for index in range(n + 1):
            y = ys + step * index
            if (index > 0 and index < n):
                state = 1
            elif (index == 0):
                if (ys == self.Ys):
                    state = 2
                else:
                    state = 1
            elif (index == n):
                if (yf == self.Yf):
                    state = 2
                else:
                    state = 1
            else:
                state = 0
            sum += self.calcFromX(y, ys, yf, step, m, state)

        return sum

    def writeFile(self, result):
        path = './Output/square.csv'
        isExit = os.path.isfile(path)
        if (isExit):
            os.remove(path)

        fileHilper = FileHelperForTrapezoid()
        fileHilper.writeToFile(result)

    def calcFromX(self, y, ys, yf, step, m, state):
        sum = 0
        approx = 0

        for index in range(m + 1):
            x = self.Xs + step * index
            if (index > 0 and index < m and state == 1):
                approx = 1
            elif (index == 0 and index == m and state == 1):
                approx = 1
            elif ((index == 0 or index == m) and state == 2):
                approx = 0.25
            else:
                approx = 0.5
            sum += approx * self.getFunc(x, y)
        
        return sum

    def getFunc(self, x, y):
        result = math.sqrt(1 + self.getFuncForX(x)**2 + self.getFuncForY(y)**2)

        return result

    def getFuncForX(self, x):
        result = self.A * 2 * x + self.C

        return result
    
    def getFuncForY(self, y):
        result = self.B * 2 * y + self.D

        return result
    
    def getFuncForWrite(self, x, y):
        result = self.A * x**2 + self.B * y**2 + self.C * x + self.D * y

        return result

    def getMatrix(self):
        countX = 0
        countY = 0
        x = 0
        y = 0
        countX = int(math.fabs(self.Xf - self.Xs))
        countY = int(math.fabs(self.Yf - self.Ys))
        myFyncZnach = []
        funcArray = []

        x = self.Xs
        for _ in range(countX):
            y = self.Ys
            for _ in range(countY):
                funcArray.append(self.getFuncForWrite(x, y))
                y += 1
            x += 1
            myFyncZnach.append(funcArray)
            funcArray = []

        return myFyncZnach

    def draw(self, x, y, z):
        xArray, yArray = np.meshgrid(x, y)
        zArray = np.array(z)
        fig = plt.figure()
        ax = fig.add_subplot(111, projection='3d')
        ax.plot_surface(xArray, yArray, np.transpose(zArray), cmap='inferno')
        ax.set_xlabel('X')
        ax.set_ylabel('Y')
        ax.set_zlabel('Z')
        fig.savefig("startup/static/surfaces/surface.png")
        plt.show()
        plt.close()

    def drawAnalysis(self, times, procNumbers):
        plt.bar(procNumbers, times)

        plt.show()
        plt.close()
