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


    def deleteDocument(self, documentIdentifier):
        """
        needs to use document identifier"""
        try:
            pc = psqlconnect()
            pc.connect()
            sql = "delete from appdocument where id = {0}".format(documentIdentifier)
            pc.cursor.execute(sql)
            self.conn.commit()
            return true
        except:
            fuu.error.message = "Unable to delete the document"
            return fuu.error

    def updateDocument(self, documentIdentifier, updateData):
        """
        updateData should only have title creator and document
        keys"""
        try:
            revisedUpdateData = []
            revisedUpdateData.append(updateData['title'])
            revisedUpdateData.append(updateData['creator'])
            revisedUpdateData.append(updateData['document'])
            revisedUpdateData.append(documentIdentifier)
            pc = psqlconnect()
            pc.connect()
            sql = "update appdocument set title = '{0}', creator = '{1}, document = '{2}' where id = '{3}'".format(revisedUpdateData)
            pc.cursor.execute(sql)
            self.conn.commit()
            return true
        except:
            fuu.error.message = "Unable to create a document"
            return fuu.error

    def readDocument(self, documentIdentifier):
        """
        needs to use document identifier"""
        try:
            pc = psqlconnect()
            pc.connect()
            sql = "select * from appdocument where id = {0}".format(documentIdentifier)
            pc.cursor.execute(sql)
            row = pc.cursor.fetchone()
            return row
        except:
            fuu.error.message = "Unable to find the document"
            return fuu.error

    def getAllDocuments(self):
        try:
            pc = psqlconnect()
            pc.connect()
            sql = "select * from appdocument order by id"
            pc.cursor.execute(sql)
            rows = pc.cursor.fetchall()
            return rows
        except:
            fuu.error.message = "Unable to find any documents"
            return fuu.error


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
