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
            return { "error": "unable to insert", "exception": sys.exc.info()[0] }

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
