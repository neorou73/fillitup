
class fillItUpMongoDb:
    def __init__(self) -> None:
        from pymongo import MongoClient
        #self.client = MongoClient()
        self.client = MongoClient('localhost', 27017)
        #self.client = MongoClient('mongodb://localhost:27017/')
        self.db = this.client.fillitup_database
        self.collection = db.fillitup_collection


if __name__ == "__main__":
    pc = psqlConnect()
    pc.connect()
    pc.getCurrentTimestamp()
