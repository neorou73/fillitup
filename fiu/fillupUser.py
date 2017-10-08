"""
CRUD operations for users
login logout forgot password
"""

from fillupDbc import psqlConnect

class fillupUser:
    def __init__(self):
        self.dictionaryKeys = ['fullname','username','email','password']


    def validateUserData(self, userData):
        present = 0
        for k in userData:
            print("has " + k)
            if k in self.dictionaryKeys:
                present = present + 1
        if present == len(self.dictionaryKeys):
            return True
        else:
            return False


    def createUser(self, userData):
        if self.validateUserKeys(userData):
            pc = psqlConnect()
            pc.connect()
            sql = "insert into appuser (fullname, username, email, password) values ({0}, {1}, md5({2}), {3})"
            pc.cursor.execute(sql.format(userData.fullname, userData.username, userData.email, userData.password))
            self.conn.commit()
            return True
        else:
            return False


    def userExists(self, userEmail):
        pc = psqlConnect()
        pc.connect()
        sql = "select email from appuser where email = '{0}'"
        pc.cursor.execute(sql.format(userEmail))
        rows = pc.cursor.fetchone()
        if rows[0] == userEmail:
            return True
        else:
            return False


    def updateUser(self, userEmail, newData):
        if self.userExists(userEmail):
            pc.psqlConnect()
            pc.connect()
            try:
                sql = "update appuser set (email = '{1}', username = '{2}', fullname = '{3}', password = md5('{4}')) where email = '{0}'".format(userEmail, newData.email, newData.username, newData.fullname, newData.password)
                pc.cursor.execute(sql)
            except:
                print("Unable to perform update")
        else:
            print('Unable to perform update, user does not exist')


    def deleteUser(self, userEmail):
        if self.userExists(userEmail):
            pc.psqlConnect()
            pc.connect()
            try:
                sql = "delete from appuser where email = '{0}'".format(userEmail)
                pc.cursor.execute(sql)
            except:
                print("Unable to perform deletion")
        else:
            print('Unable to perform deletion, user does not exist')


    def getUser(self, userEmail):
        pc.psqlConnect()
        pc.connect()
        try:
            sql = "select * from appuser where email = '{0}'".format(userEmail)
            pc.cursor.execute(sql)
            row = pc.fetchone()
            return row
        except:
            return "Unable to find user in records."

    def getAllUsers(self):
        pc.psqlConnect()
        pc.connect()
        try:
            sql = "select id, email, username, fullname, status, created from appuser order by id"
            pc.cursor.execute(sql)
            row = pc.fetchall()
            return row
        except:
            return "Unable to find users in records."

    def loginUser(self, userEmail, password):
        pass


    def logoutUser(self, userEmail):
        pass


    def sendEmailToUser(self, userEmail):
        pass


if __name__ == "__main__":
    fuu = fillupUser()
    test = { 
        "fullname": "Kris Poe", 
        "username": "neorou73", 
        "email": "neorou@gmail.com", 
        "password": "5ecret!" 
    }

    if (fuu.validateUserData(test)):
        print('test user is valid')

    if fuu.userExists("fake@random.com"):
        print('can test user data')

    print('done running main')
