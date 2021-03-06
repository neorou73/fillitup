"""
CRUD operations for users
login logout forgot password
"""

from fillupDbc import psqlConnect

class fillupUser:
    def __init__(self):
        self.dictionaryKeys = ['fullname','username','email','password']
        self.error = { "message": "" }

    def validateUserData(self, userData):
        present = 0
        for k,v in userData.items():
            # print("has " + k)
            if k in self.dictionaryKeys:
                present = present + 1
        if present == len(self.dictionaryKeys):
            return True
        else:
            return False


    def createUser(self, userData):
        if self.validateUserData(userData):
            pc = psqlConnect()
            pc.connect()
            # print(userData.keys())
            sql = "insert into appuser (fullname, username, email, password) values ('{0}', '{1}', '{2}', md5('{3}'))"
            pc.cursor.execute(sql.format(userData['fullname'], userData['username'], userData['email'], userData['password']))
            pc.conn.commit()
            return True
        else:
            return False


    def userExists(self, userEmail):
        pc = psqlConnect()
        pc.connect()
        sql = "select email from appuser where email = '{0}'"
        pc.cursor.execute(sql.format(userEmail))
        rows = pc.cursor.fetchone()
        # print(rows)
        if rows[0] == userEmail:
            return True
        else:
            return False


    def updateUser(self, userEmail, newData):
        if self.userExists(userEmail):
            pc = psqlConnect()
            pc.connect()
            try:
                sql = "update appuser set (email = '{1}', username = '{2}', fullname = '{3}', password = md5('{4}')) where email = '{0}'".format(userEmail, newData.email, newData.username, newData.fullname, newData.password)
                pc.cursor.execute(sql)
            except:
                message = "Unable to perform update"
                return message
        else:
            message = 'Unable to perform update, user does not exist'
            return message


    def deleteUser(self, userEmail):
        if self.userExists(userEmail):
            pc = psqlConnect()
            pc.connect()
            try:
                sql = "delete from appuser where email = '{0}'".format(userEmail)
                pc.cursor.execute(sql)
                pc.conn.commit()
                return ("success")
            except:
                print("Unable to perform deletion")
        else:
            print('Unable to perform deletion, user does not exist')


    def getUser(self, userEmail):
        pc = psqlConnect()
        pc.connect()
        try:
            sql = "select * from appuser where email = '{0}'".format(userEmail)
            pc.cursor.execute(sql)
            row = pc.cursor.fetchone()
            return row
        except:
            message = "Unable to find user in records."
            return message

    def getAllUsers(self):
        pc = psqlConnect()
        pc.connect()
        try:
            sql = "select id, email, username, fullname, status, created from appuser order by id"
            pc.cursor.execute(sql)
            row = pc.cursor.fetchall()
            return row
        except:
            message = "Unable to find users in records."
            return message


    def loginUser(self, userEmail, password):
        pc = psqlConnect()
        pc.connect()
        try:
            sql = "select * from appuser where email = '{0}' and password = md5('{1}')".format(userEmail, password)
            pc.cursor.execute(sql)
            row = pc.cursor.fetchone()
            if len(row) > 0:
                userToken = "thisIsAGeneralTestT0k3n"
                import uuid
                accessToken = str(uuid.uuid4())
                sql2 = "insert into logintoken (token, appuser, created) values ('{0}', {1}, now())".format(accessToken, row[0])
                # print(row[0], userToken, sql2)
                pc.cursor.execute(sql2)
                pc.conn.commit()
                return accessToken
            else:
                return "Unable to find users in records."
        except:
            # import sys
            # print (sys.exc_info[0])
            return "Unable to find users in records."


    def logoutUser(self, userEmail):
        pc = psqlConnect()
        pc.connect()
        try:
            sql = "select * from appuser where email = '{0}'".format(userEmail)
            pc.cursor.execute(sql)
            row = pc.cursor.fetchone()
            # print(row)
            sql2 = "update logintoken set logged_out = now() where appuser = {0}".format(row[0])
            # print(row[0], sql2)
            pc.cursor.execute(sql2)
            pc.conn.commit()
        except:
            import sys
            print (sys.exc_info()[0])
            return "Unable to find user in records."


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
        fuu.loginUser('fake@random.com','admin')
        fuu.logoutUser('fake@random.com','thisIsAGeneralTestT0k3n')

    print('done running main')
