class Crud:

    def __init__(self):
        self.created = True

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
