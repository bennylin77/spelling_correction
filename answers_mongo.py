from pymongo import MongoClient
client = MongoClient()
client = MongoClient('localhost', 27017)
db = client.vizwiz
answers = db.answers

import json
with open('answers.json') as data_file:
    data = json.load(data_file)


for index, item in enumerate(data):
	answer_id = answers.insert_one(item).inserted_id;
