"""
a single test file for unit testing
"""
import unittest

def makeObject():
    data = {}
    data["can_create"] = "yes"
    return data

testFile = 'can_create_file.json'

class TestCrud(unittest.TestCase):

    def test_create_file(self):
        """
        tests the crud create method
        assert true can create a file
        check that file can be created
        and file is json
        """
        from crud import Crud
        c = Crud()
        data = makeObject()
        self.assertTrue(c.create(data, testFile))
        self.assertEqual(data["can_create"], "yes")

    def test_read_file(self):
        """
        tests the crud create method
        returns a valid file path"""
        from crud import Crud
        c = Crud()
        data = makeObject()
        c.create(data, testFile)
        readData = c.read(testFile)
        self.assertEqual(readData["can_create"], "yes")
        
if __name__ == '__main__':
    unittest.main()
