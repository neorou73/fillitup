"""
taken from https://docs.mongodb.com/getting-started/python/introduction/
to install driver
pip install pymongo

example of looking for data loaded from https://raw.githubusercontent.com/mongodb/docs-assets/primer-dataset/primer-dataset.json
to load use: mongoimport --db test --collection restaurants --drop --file ~/downloads/primer-dataset.json

"""
from pymongo import MongoClient

client = MongoClient()
# client = MongoClient("mongodb://mongodb0.example.net:27017")

db = client.test
coll = db.dataset

"""
# import one data set into the test database

from datetime import datetime
result = db.restaurants.insert_one(
    {
        "address": {
            "street": "2 Avenue",
            "zipcode": "10075",
            "building": "1480",
            "coord": [-73.9557413, 40.7720266]
        },
        "borough": "Manhattan",
        "cuisine": "Italian",
        "grades": [
            {
                "date": datetime.strptime("2014-10-01", "%Y-%m-%d"),
                "grade": "A",
                "score": 11
            },
            {
                "date": datetime.strptime("2014-01-16", "%Y-%m-%d"),
                "grade": "B",
                "score": 17
            }
        ],
        "name": "Vella",
        "restaurant_id": "41704620"
    }
)

print(result.inserted_id)
"""

# look for (find) a restaurant, use the $or - can be $and

cursor = db.restaurants.find({"$or": [{"cuisine": "Italian"}, {"address.zipcode": "10075"}]})
for document in cursor:
    print(document)

# update data with update_one() or update_many()

result = db.restaurants.update_one(
    {"name": "Juni"},
    {
        "$set": {
            "cuisine": "American (New)"
        },
        "$currentDate": {"lastModified": True}
    }
)

print (result.matched_count) # look for items matching the query
print (result.modified_count) # look for items modified by the query

# update data with update_many()

result = db.restaurants.update_many(
    {"address.zipcode": "10016", "cuisine": "Other"},
    {
        "$set": {"cuisine": "Category To Be Determined"},
        "$currentDate": {"lastModified": True}
    }
)

print (result.matched_count)
print (result.modified_count)

# update or replace entire document

result = db.restaurants.replace_one(
    {"restaurant_id": "41704620"},
    {
        "name": "Vella 2",
        "address": {
            "coord": [-73.9557413, 40.7720266],
            "building": "1480",
            "street": "2 Avenue",
            "zipcode": "10075"
        }
    }
)

print (result.matched_count)
print (result.modified_count)

# delete one instance with delete_one()
# delete multiple instances with delete_many()
# result = db.restaurants.delete_many({"borough": "Manhattan"})

# remove all documents from a collection with blank object
# result = db.restaurants.delete_many({})

# drop an entire collection using drop()
# result = db.restaurants.drop()

# aggregation using the $group keyword
cursor = db.restaurants.aggregate(
    [
        {"$group": {"_id": "$borough", "count": {"$sum": 1}}}
    ]
)

for document in cursor:
    print(document)

# filter documents by using the $match keyword
cursor = db.restaurants.aggregate(
    [
        {"$match": {"borough": "Queens", "cuisine": "Brazilian"}},
        {"$group": {"_id": "$address.zipcode", "count": {"$sum": 1}}}
    ]
)

for document in cursor:
    print(document)

# create indexes on a collection if not yet existing using create_index()
import pymongo
db.restaurants.create_index([("cuisine", pymongo.ASCENDING)])

# create compound indexes
db.restaurants.create_index([
    ("cuisine", pymongo.ASCENDING),
    ("address.zipcode", pymongo.DESCENDING)
])
