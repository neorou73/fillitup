"""
a single test file for unit testing
"""
import unittest

def makeObject():
    data = {}
    data["can_create"] = "yes"
    return data

def updateData(data):
    data["was_updated"] = "yes"
    return data

testFile = 'can_create_file.json'

# figure out from here: https://docs.python.org/3.6/library/subprocess.html

class TestCrud(unittest.TestCase):

    def canCreateUser(self):
        pass

    def canEditUser(self):
        pass

    def canReadOneUser(self):
        pass

    def canReadAllUsers(self):
        pass

    def canDestroyUser(self):
        pass

    def canConnectToDatabase(self):
        from fillupDbc import psqlConnect
        pc = psqlConnect()
        pc.connect()
        pc.cursor.execute("""SELECT now();""")
        rows = pc.cursor.fetchall()
        self.assertTrue(len(rows) > 0)

    def canQueryDatabase(self):
        from fillupDbc import psqlConnect
        pc = psqlConnect()
        pc.connect()
        pc.cursor.execute("""SELECT now();""")
        rows = pc.cursor.fetchall()
        self.assertTrue(len(rows) > 0)

    def canCreateDocument(self):
        pass

    def canEditDocument(self):
        pass

    def canDeleteDocument(self):
        pass

    def canGetOneDocument(self):
        pass

    def canGetAllDocuments(self):
        pass




if __name__ == '__main__':
    unittest.main()
