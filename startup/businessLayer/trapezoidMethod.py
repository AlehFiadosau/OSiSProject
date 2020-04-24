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

        y = self.Ys
        for _ in range(countY):
            x = self.Xs
            for _ in range(countX):
                funcArray.append(self.getFunc(x, y))
                x += 1
            y += 1
            myFyncZnach.append(funcArray)
            funcArray = []

        return myFyncZnach

    def draw(self, x, y, z):
        X, Y = np.meshgrid(x, y)
        Z = np.array(z)
        fig = plt.figure()
        ax = fig.add_subplot(111, projection='3d')
        ax.plot_surface(X, Y, np.transpose(Z), cmap='inferno')
        ax.set_xlabel('X')
        ax.set_ylabel('Y')
        ax.set_zlabel('Z')
        plt.show()
        plt.close()
