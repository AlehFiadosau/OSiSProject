from scipy.interpolate import interp1d
from mpl_toolkits.mplot3d import axes3d
from datetime import datetime
import time
import struct
import numpy as np
import matplotlib.pyplot as plt
from matplotlib import pyplot
import math
import matplotlib
from multiprocessing import Pool
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

    def execute(self, n, processesNumber):
        sum = 0
        res = 0

        startTime = datetime.now()

        iters = n / processesNumber
        h = (self.Yf - self.Ys) / processesNumber
        p = Pool(processes=processesNumber)

        for index in range(processesNumber):
            ys = self.Ys + h * index
            yf = self.Ys + h * (index + 1)
            res = p.apply_async(self.calcFromY, (ys, yf, math.ceil(iters)))
            sum += res.get()

        p.close()
        p.join()

        executeTime = datetime.now() - startTime

        return [sum, executeTime]

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

    def calcFromY(self, ys, yf, n):
        sum = 0
        hy = (yf - ys) / n
        hx = (self.Xf - self.Xs) / n

        for index in range(n):
            y = ys + hy * index
            if (index == 0 or index == n):
                sum += self.calcFromX(y, hx, n, True, False)
            else:
                sum += self.calcFromX(y, hx, n, False, False)

        return sum * hy

    def calcFromX(self, y, hx, n, isStart=False, isFinish=False):
        result = 0

        for index in range(n):
            x = self.Xs + hx * index
            if (isStart and index == 0 or isFinish and index == n):
                result += self.getFunc(x, y) / 4
            elif (isFinish or isStart):
                result += self.getFunc(x, y) / 2
            else:
                result += self.getFunc(x, y)

        return result * hx

    def getFunc(self, x, y):
        result = self.A * math.pow(x, 2) + self.B * \
            math.pow(y, 2) + self.C * x + self.D * y

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
                funcArray.append(self.getFunc(x, y))
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

    def drawAnalysis(self):
        data_names = ['Москва', 'Санкт-Петербург', 'Сочи', 'Архангельск',
                      'Владимир', 'Краснодар', 'Курск', 'Воронеж',
                      'Ставрополь', 'Мурманск']

        data_values = [1076, 979, 222, 189, 137, 134, 124, 124, 91, 79]

        dpi = 80
        fig = plt.figure(dpi=dpi, figsize=(512 / dpi, 384 / dpi))
        pyplot.rcParams.update({'font.size': 9})

        plt.title('Распределение кафе по городам России (%)')

        xs = range(len(data_names))

        plt.pie(
            data_values, autopct='%.1f', radius=1.1,
            explode=[0.15] + [0 for _ in range(len(data_names) - 1)])
        plt.legend(
            bbox_to_anchor=(-0.16, 0.45, 0.25, 0.25),
            loc='lower left', labels=data_names)
        fig.savefig('pie.png')

        plt.show()
        plt.close()
