import math
import matplotlib
matplotlib.use('TkAgg')
from matplotlib import pyplot
import matplotlib.pyplot as plt
import numpy as np
import struct
import time
from datetime import datetime
from mpl_toolkits.mplot3d import axes3d
from scipy.interpolate import interp1d


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

    def execute(self, n):
        result = 0

        startTime = datetime.now()
        hx, hy = self.heightCalc(n)

        for index in range(self.Xs, self.Xf - 1):
            x = self.Xs + hx * index
            result += self.calcFromY(x, hy)

        result = result * hx * hy
        executeTime = datetime.now() - startTime

        return [result, executeTime]

    def heightCalc(self, n):
        hx = (self.Xf - self.Xs) / n
        hy = (self.Yf - self.Ys) / n

        return [hx, hy]

    def calcFromY(self, x, hy):
        result = 0
        for index in range(self.Ys, self.Yf - 1):
            y = self.Ys + hy * index
            if (index == self.Ys):
                result += self.getFunc(x, y) / 4
            elif (index == self.Yf):
                result += self.getFunc(x, y) / 2
            else:
                result += self.getFunc(x, y)

        return result

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
        countY = int(math.fabs(self.Ys - self.Yf))
        myFyncZnach = []
        funcArray = []
        x = self.Xs

        for row in range(countX):
            y = self.Ys
            for column in range(countY):
                funcArray.append(self.getFunc(x, y))
                y += 1
            x += 1
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
