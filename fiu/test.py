"""
a single test file for unit testing
"""
import unittest, json, uuid

class TestCrud(unittest.TestCase):

    def setUp(self):
        testUser = {}
        testUser["fullname"] = "Test User"
        testUser["username"] = "testuser1"
        testUser["email"] = "neorou@yahoo.com"
        testUser["password"] = "5ecret!"
        self.testUser = testUser

        updatedUserData = {}
        updatedUserData["fullname"] = "Test User Updated"
        updatedUserData["username"] = "testuser2"
        updatedUserData["password"] = "5ecret!2"
        updatedUserData["email"] = "neorou@yahoo.com"
        self.updatedUserData = updatedUserData

        from fillupUser import fillupUser
        self.fuu = fillupUser()
        from fillupDocument import fillupDocument
        self.fud = fillupDocument()
        
        documentData = {}
        self.uuid4 = uuid.uuid4()
        documentData["id"] = self.uuid4
        documentData["title"] = "A Sample Document"
        documentData["creator"] = 1
        documentData["document"] = json.loads('{ "drink": "coffee", "food": "eggs, yogurt, nuts, fruit and toast" }')
        self.documentData = documentData
        self.updatedDocument = documentData
        self.updatedDocument["title"] = "An Updated Document"
        self.updatedDocument["document"] = json.loads('{ "drink": "tea", "food": "rice, vegetables, fried fish and peanut sauce" }')


    def test_canCreateAndDestroyUser(self):
        success = self.fuu.createUser(self.testUser)
        self.assertTrue(success)
        success2 = self.fuu.deleteUser("neorou@yahoo.com")
        self.assertEqual(success2, "success")
            

    def test_canEditUser(self):
        self.fuu.createUser(self.testUser)
        success = self.fuu.updateUser("neorou@yahoo.com", self.updatedUserData)
        self.assertTrue(success)
        self.fuu.deleteUser("neorou@yahoo.com")


    def test_canConnectAndQueryToDatabase(self):
        from fillupDbc import psqlConnect
        pc = psqlConnect()
        pc.connect()
        pc.cursor.execute("""SELECT now();""")
        rows = pc.cursor.fetchall()
        self.assertTrue(len(rows) > 0)


    def test_canCreateDocument(self):
        result = self.fud.createDocument(self.documentData)
        self.assertTrue(result, "success")
        result2 = self.fud.deleteDocument(self.uuid4)
        self.assertTrue(result2, "success")


    def test_canUpdateDocument(self):
        result = self.fud.createDocument(self.documentData)
        self.assertTrue(result, "success")
        result2 = self.fud.updateDocument(self.uuid4, self.updatedDocument)
        self.assertTrue(result2, "success")
        result3 = self.fud.deleteDocument(self.uuid4)
        self.assertTrue(result3, "success")


if __name__ == '__main__':
    unittest.main()
