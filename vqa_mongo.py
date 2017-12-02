from pymongo import MongoClient
client = MongoClient()
client = MongoClient('localhost', 27017)
db = client.vizwiz
vqas = db.vqa

import json
with open('v2_OpenEnded_mscoco_train2014_questions.json') as data_file:
    data = json.load(data_file)

#print(data['questions']);

for index, item in enumerate(data['questions']):
	v_id = vqas.insert_one(item).inserted_id;
#if 999 == index:
#	break;
