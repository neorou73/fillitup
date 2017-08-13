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
# how to test that mongod service is running

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

    def test_update_file(self):
        """
        tests the crud create method
        returns a valid file path"""
        from crud import Crud
        c = Crud()
        data = makeObject()
        c.create(data, testFile)
        newData = updateData(data)
        c.update(newData, testFile)
        readData = c.read(testFile)
        self.assertEqual(readData["was_updated"], "yes")

    def test_delete_file(self):
        """
        tests the delete function for flat files"""
        from crud import Crud
        c = Crud()
        data = makeObject()
        c.create(data, testFile)
        self.assertTrue(c.delete(testFile))

    """"
    def test_mdb_create_collection(self):
        from crud import Crud
        c = Crud()
        collection = c.mdb.testcollection
        result = collection.insert_one({ "test": "success" })
        # print("inserted id: ", result.inserted_id)
        self.assertFalse(result.inserted_id == None)
    """

    def test_mdb_create_record(self):
        from crud import Crud
        c = Crud()
        # delete all data from collection first
        result_clear = c.mdb_delete({}, "testcollection")
        result_id = c.mdb_create({ "test": "success", "testing insert": "success" }, "testcollection")
        self.assertFalse(result_id == None)

    def test_mdb_search_for_one(self):
        from crud import Crud
        c = Crud()
        result_clear = c.mdb_delete({}, "testcollection")
        result_id = c.mdb_create({ "test": "success", "testing insert": "success" }, "testcollection")
        result = c.mdb_search_for_one({ "test": "success" }, "testcollection")
        self.assertFalse(result == None)

    def test_mdb_search_for_all(self):
        from crud import Crud
        c = Crud()
        result_clear = c.mdb_delete({}, "testcollection")
        result_id1 = c.mdb_create({ "test1": "success", "testing insert1": "success" }, "testcollection")
        result_id2 = c.mdb_create({ "test2": "success", "testing insert2": "success" }, "testcollection")
        result = c.mdb_search_for_all("testcollection")
        matches = 0
        for d in result:
            # print(d)
            matches = matches + 1
        self.assertFalse(result == None)
        self.assertEqual(matches, 2)

    def test_mdb_update_one(self):
        from crud import Crud
        c = Crud()
        result_clear = c.mdb_delete({}, "testcollection")
        result_id1 = c.mdb_create({ "test1": "success", "testing insert1": "success" }, "testcollection")
        result_id2 = c.mdb_create({ "test2": "success", "testing insert2": "success" }, "testcollection")
        result_update = c.mdb_update_one({ "test2": "success" }, { "$set": { "testing insert2": "success for the second time" }}, "testcollection")
        self.assertFalse(result_update == None)
        self.assertEqual(result_update.modified_count, 1)

    def test_mdb_update_many(self):
        from crud import Crud
        c = Crud()
        result_clear = c.mdb_delete({}, "testcollection")
        result_id1 = c.mdb_create({ "test1": "success", "testing insert1": "success", "category": "undefined" }, "testcollection")
        result_id2 = c.mdb_create({ "test2": "success", "testing insert2": "success", "category": "undefined" }, "testcollection")
        result_update = c.mdb_update_many({ "category": "undefined" }, { "$set": { "category": "tests" }}, "testcollection")
        print(result_update.modified_count)
        self.assertFalse(result_update == None)
        self.assertEqual(result_update.modified_count, 2)

    def test_mdb_replace_one(self):
        pass

    def test_mdb_delete_one(self):
        pass

    def test_mdb_delete_many(self):
        pass

    # def test_mdb_drop_collection(self):
        # pass

        
if __name__ == '__main__':
    unittest.main()
