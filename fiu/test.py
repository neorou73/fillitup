"""
a single test file for unit testing
"""
import unittest

class TestCrud(unittest.TestCase):

    def test_canCreateAndDestroyUser(self):
        from fillupUser import fillupUser
        fuu = fillupUser()
        testUser = {}
        testUser["fullname"] = "Test User"
        testUser["username"] = "testuser1"
        testUser["email"] = "neorou@yahoo.com"
        testUser["password"] = "5ecret!"

        success = fuu.createUser(testUser)
        self.assertTrue(success)
        success2 = fuu.deleteUser("neorou@yahoo.com")
        self.assertEqual(success2, "success")
            

    def test_canEditUser(self):
        from fillupUser import fillupUser
        fuu = fillupUser()
        testUser = {}
        testUser["fullname"] = "Test User"
        testUser["username"] = "testuser1"
        testUser["email"] = "neorou@yahoo.com"
        testUser["password"] = "5ecret!"

        fuu.createUser(testUser)
        updatedUserData = {}
        updatedUserData["fullname"] = "Test User Updated"
        updatedUserData["username"] = "testuser2"
        updatedUserData["password"] = "5ecret!2"
        updatedUserData["email"] = "neorou@yahoo.com"

        success = fuu.updateUser("neorou@yahoo.com", updatedUserData)
        self.assertTrue(success)
        fuu.deleteUser("neorou@yahoo.com")


    def test_canConnectToDatabase(self):
        from fillupDbc import psqlConnect
        pc = psqlConnect()
        pc.connect()
        pc.cursor.execute("""SELECT now();""")
        rows = pc.cursor.fetchall()
        self.assertTrue(len(rows) > 0)

    def test_canQueryDatabase(self):
        from fillupDbc import psqlConnect
        pc = psqlConnect()
        pc.connect()
        pc.cursor.execute("""SELECT now();""")
        rows = pc.cursor.fetchall()
        self.assertTrue(len(rows) > 0)


if __name__ == '__main__':
    unittest.main()
