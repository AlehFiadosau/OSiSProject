from .trapezoidMethod import TrapezoidMethod
from Crypto.Cipher import DES

class Analysis():
    Token = ""
    Trapezoid = TrapezoidMethod()
    Key = b'abcdefgh'
    Des = DES.new(Key, DES.MODE_ECB)

    def setKey(self, key):
        self.Key = key

    def setToken(self, token):
        self.Token = token

    def setTrapezoid(self, trapezoid):
        self.Trapezoid = trapezoid

    def createToken(self):
        text = self.__dataEnctyption__()
        padText = self.__pad__(text)
        encryText = self.Des.encrypt(padText)

        return encryText
    
    def getToken(self, ecryText):
        data = self.Des.decrypt(ecryText)

        return data

    def __dataEnctyption__(self):
        xs = self.Trapezoid.Xs
        xf = self.Trapezoid.Xf
        ys = self.Trapezoid.Ys
        yf = self.Trapezoid.Yf
        text = str(xs) + ',' + str(xf) + ',' + str(ys) + ',' + str(yf)

        return bytes(text, encoding = 'utf-8')

    def __pad__(self, text):
        while len(text) % 8 != 0:
            text += b' '
 
        return text
