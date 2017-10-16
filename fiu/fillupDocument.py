"""
fillupDocument.py
CRUD operations for documents
"""

from fillupUser import fillupUser
from fillupDbc import psqlConnect
import sys, json

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
            pc = psqlConnect()
            pc.connect()
            sql = "insert into appdocument (title, creator, document, created) values ('{0}',{1},'{2}',now())".format(documentObject['title'], documentObject['creator'], json.dumps(documentObject['document']))
            pc.cursor.execute(sql)
            pc.conn.commit()
            return "success"
        except:
            message = "Unable to create a document"
            return [message, sys.exc_info()]


    def deleteDocument(self, documentIdentifier):
        """
        needs to use document identifier"""
        try:
            pc = psqlConnect()
            pc.connect()
            sql = "delete from appdocument where id = {0}".format(documentIdentifier)
            pc.cursor.execute(sql)
            pc.conn.commit()
            return "success"
        except:
            message = "Unable to delete the document"
            return [message, sys.exc_info()]


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
            pc = psqlConnect()
            pc.connect()
            sql = "update appdocument set title = '{0}', creator = '{1}, document = '{2}' where id = '{3}'".format(revisedUpdateData)
            pc.cursor.execute(sql)
            pc.conn.commit()
            return "success"
        except:
            message = "Unable to create a document"
            return [message, sys.exc_info()]

    def readDocument(self, documentIdentifier):
        """
        needs to use document identifier"""
        try:
            pc = psqlConnect()
            pc.connect()
            sql = "select * from appdocument where id = {0}".format(documentIdentifier)
            pc.cursor.execute(sql)
            row = pc.cursor.fetchone()
            return row
        except:
            message = "Unable to find the document"
            return [message, sys.exc_info()]

    def getAllDocuments(self):
        try:
            pc = psqlConnect()
            pc.connect()
            sql = "select * from appdocument order by id"
            pc.cursor.execute(sql)
            rows = pc.cursor.fetchall()
            return rows
        except:
            message = "Unable to find any documents"
            return [message, sys.exc_info()]


if __name__ == "__main__":
    import json
    fud = fillupDocument()
    documentData = {}
    documentData["title"] = "A Sample Document"
    documentData["creator"] = 1
    documentData["document"] = json.loads('{ "drink": "coffee", "food": "eggs, yogurt, nuts, fruit and toast" }')

    result = fud.createDocument(documentData)
    print(result)
