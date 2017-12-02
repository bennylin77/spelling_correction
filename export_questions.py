import json
from pymongo import MongoClient
client = MongoClient()
client = MongoClient('localhost', 27017)
db = client.vizwiz
entries = db.entries


data_set = [];
for entry in entries.find():
	data = {}
	data["image"] = entry["image"]
	data["question"] = entry["question"]
	data["responses"] = entry["responses"] if "responses" in entry else []
	data["private"] = entry["private"]
	data_set.append(data)

with open('dedup_Oct_27_2017.json', 'w') as json_file:
	json.dump(data_set, json_file)
