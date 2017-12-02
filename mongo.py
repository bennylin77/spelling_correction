from pymongo import MongoClient
client = MongoClient()
client = MongoClient('localhost', 27017)
db = client.vizwiz
entries = db.entries

import json
with open('dedup_new.json') as data_file:
    data = json.load(data_file)


for index, item in enumerate(data):
	post_id = entries.insert_one(item).inserted_id;
#if 999 == index:
#	break;
