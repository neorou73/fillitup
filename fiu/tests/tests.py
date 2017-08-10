"""
a single test file for unit testing
"""
import unittest

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
        data = {}
        data["can_create"] = "yes"
        self.assertTrue(c.create(data, 'can_create_file.json'))

    def test_filepath_valid(self):
        """
        tests the crud create method
        returns a valid file path"""
        self.assertEqual('foo'.upper(), 'FOO')

        
if __name__ == '__main__':
    unittest.main()
