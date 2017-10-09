"""
fillupDocument.py
CRUD operations for documents
"""

from fillupUser import fillupUser
from fillupDbc import psqlConnect

class fillupDocument:

    def __init__(self):
        # fuu = fillupUser()
        self.userValid = False
        self.documentObjectValid = False


    def createDocument(self, documentObject):
        """
        requires the following documentObject keys:
        title, creator (appuser.id), document as JSON data
        """
        try:
            pc = psqlconnect()
            pc.connect()
            sql = "insert into appdocument (title, creator, document, created) values ('{0}',{1},'{2}',now())".format(documentObject)
            pc.cursor.execute(sql)
            self.conn.commit()
            return true
        except:
            fuu.error.message = "Unable to create a document"
            return fuu.error


    def getDocument(self, documentIdentifier):
        pass

    def updateDocument(self, documentIdentifer):
        pass

    def deleteDocument(self, documentIdentifier):
        pass

    def getAllDocuments(self):
        pass


if __name__ == "__main__":
    fud = fillupDocument()
    documentData = {
        "title": "A Sample Document",
        "creator": 1,
        "document": {
            "drink": "coffee",
            "food": "eggs, yogurt, nuts, fruit and toast"
        }
    }

    if fud.createDocument(documentData):
        print("success")    
