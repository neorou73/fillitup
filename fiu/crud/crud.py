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
                json.dump(objectData, fp)
            return True
        except:
            return False
