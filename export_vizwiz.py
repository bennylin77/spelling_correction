import json
from pymongo import MongoClient
client = MongoClient()
client = MongoClient('localhost', 27017)
db = client.vizwiz
cats = db.cats


data_set = [];
for cat in cats.find():
	data = {}
	data["image"] = cat["image"]
	data["question"] = cat["question"]
	data["answers"] = cat["answers"]
	data_set.append(data)

with open('vizwiz_Nov_11_2017.json', 'w') as json_file:
	json.dump(data_set, json_file)
