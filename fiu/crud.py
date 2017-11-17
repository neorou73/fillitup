class Crud:

    def __init__(self):
        self.created = True
        # import from pymongo
        from pymongo import MongoClient

        client = MongoClient()
        # client = MongoClient("mongodb://mongodb0.example.net:27017")
        self.mdb = client.fillitup # database is called fillitup
        #self.coll = self.mdb.dataset


    # below lists all mongodb methods
    def mdb_create(self, data, collection):
        """
        requires valid json data and valid collection in self.mdb
        returns object id"""
        try:
            result = self.mdb[collection].insert_one(data)
            return result.inserted_id
        except:
            import sys
            return { "error": "unable to insert", "exception": sys.exc_info()[0] }


    def mdb_search_for_one(self, data, collection):
        """
        requires valid json data attribute and value to search against
        and valid collection in self.mdb
        returns match"""
        try:
            result = self.mdb[collection].find(data)
            return result
        except:
            import sys
            return { "error": "unable to perform search for one", "exception": sys.exc_info()[0] }


    def mdb_search_for_all(self, collection):
        """
        requires valid collection in self.mdb
        searches for all documents in that collection
        returns match"""
        try:
            result = self.mdb[collection].find({})
            return result
        except:
            import sys
            return { "error": "unable to perform search for all", "exception": sys.exc_info()[0] }


    def mdb_delete(self, data, collection):
        """
        collection needs to be a valid collection in database
        returns match"""
        try:
            result = self.mdb[collection].delete_many(data)
            return result
        except:
            import sys
            return { "error": "unable to perform deletion of data", "exception": sys.exc_info()[0] }


    def mdb_update_one(self, searchIdentifier, replacementData, collection):
        """
        valid collection is a must
        searchIdentifier and replacementData are objects
        returns match"""
        try:
            result = self.mdb[collection].update_one(searchIdentifier, replacementData)
            return result
        except:
            import sys
            return { "error": "unable to update the data as queried", "exception": sys.exc_info()[0] }


    def mdb_update_many(self, searchIdentifier, replacementData, collection):
        """
        valid collection is a must
        searchIdentifier and replacementData are objects
        returns match"""
        try:
            result = self.mdb[collection].update_many(searchIdentifier, replacementData)
            return result
        except:
            import sys
            return { "error": "unable to update the data as queried", "exception": sys.exc_info()[0] }


    def mdb_delete_many(self, searchIdentifier, collection):
        try:
            result = self.mdb[collection].delete_many(searchIdentifier)
            return result
        except:
            import sys
            return { "error": "unable to delete the data as queried", "exception": sys.exc_info()[0] }


    def mdb_drop_collection(self, collection):
        try:
            result = self.mdb[collection].drop()
            return result
        except:
            import sys
            return { "error": "unable to drop collection", "exception": sys.exc_info()[0] }


    # below lists all basic flat file methods
    def create(self, data, filePath):
        """requires a valid python object and a filepath
        returns the filePath if valid
        throws exception that filePath is not valid
        returns boolean"""
        try:
            import json
            with open(filePath, 'w') as fp:
                json.dump(data, fp)
            return True
        except:
            return False


    def read(self, filePath):
        """requires a valid filepath
        reads file if exists
        returns data"""
        try:
            import json
            with open(filePath, 'r') as fp:
                return json.load(fp)
        except:
            return { "error": "invalid file path" }


    def update(self, newData, filePath):
        """requires a valid filepath
        reads file if exists
        returns data"""
        try:
            import json
            with open(filePath, 'w') as fp:
                json.dump(newData, fp)
            return True
        except:
            return False


    def delete(self, filePath):
        """requires a valid filepath
        reads file if exists
        returns data"""
        try:
            import os
            os.remove(filePath)
            return True
        except:
            return False
