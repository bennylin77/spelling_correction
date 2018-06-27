from pymongo import MongoClient
client = MongoClient()
client = MongoClient('localhost', 27017)
db = client.vizwiz
cats = db.cats

import json
with open('vizwiz_new_1_11_2018.json') as data_file:
    data = json.load(data_file)


for index, item in enumerate(data):
	post_id = cats.insert_one(item).inserted_id;
