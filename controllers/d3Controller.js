const mongoose = require("mongoose");
const Entry = require("../schema/entry");
const Vqa = require("../schema/vqa");
const Answer = require("../schema/answer");
const Cat = require("../schema/cat");
const router = require("express").Router();

router.get('/all', all);
router.get('/answers', answers);
router.get('/vqa_sunburst', vqaSunburst);
router.get('/word_cloud', wordCloud);


function answers(req, res) {
	//res.render('spelling/index.ejs')
	//var process = spawn('python3.6',["candidates.py", 123]);
  Cat.find( {}, 'answers').exec( function (err, entries) {
      if (err)
          res.send(err);
      else{
				 var data = { 'name': "", "children":[] };

				 for( var entry in entries ){
					 answers=entries[entry].answers
					 for( var ans_index in answers ){
						 if(answers[ans_index].answer){
								var ans = answers[ans_index].answer.toLowerCase()
								ans = ans.replace(/^"(.*)"$/, '$1')
								ans = ans.replace(/(\r\n|\n|\r)/gm,"");
								ans = ans.trim()
								ans = ans.replace(/[^\x00-\x7F]/g, "");
								console.log(ans)
								if(ans)
									if( ans.search("unsuitable")==-1 && ans.search("unanswerable")==-1)
										buildData(data.children, ans.match(/\b(\w+)\b/g), 0)
								/*
								if( ans.search("unsuitable")==-1 && ans.search("unanswerable")==-1){
									   console.log(ans)
										 if (data[ans]){
											 data[ans]++;
										 } else {
											 data[ans] = 1;
										 }
								}
								*/

						 	}
						}
				 }

/*
				 for( var entry in entries){
					  //console.log(entry)
				 		buildData(data.children, entries[entry].question.match(/\b(\w+)\b/g), 0)
			 	 }
*/

				 //console.log(data)
				 res.render('d3/index.ejs', {entries: entries, data: data})
			}
  });
}




function wordCloud(req, res) {

	Cat.find( {}, 'answers').exec( function (err, entries) {
      if (err)
          res.send(err);
      else{
				 data = {}
				 for( var entry in entries ){
					 answers=entries[entry].answers
					 for( var ans_index in answers ){
						 if(answers[ans_index].answer){
								var ans = answers[ans_index].answer.toLowerCase()
								ans = ans.replace(/^"(.*)"$/, '$1')
								ans = ans.replace(/(\r\n|\n|\r)/gm,"");
								ans = ans.trim()
								if( ans.search("unsuitable")==-1 && ans.search("unanswerable")==-1){
									   console.log(ans)
										 if (data[ans]){
											 data[ans]++;
										 } else {
											 data[ans] = 1;
										 }
								}
						 	}
						}
				 }
				 const filtered = Object.keys(data)
				   .filter(key =>  data[key] >= 0 )
				   .reduce((obj, key) => {
				     obj[key] = data[key];
				     return obj;
				   }, {});
				 res.render('d3/word_cloud.ejs', {data: filtered})
			}
  });
}


function vqaSunburst(req, res) {
	//res.render('spelling/index.ejs')
	//var process = spawn('python3.6',["candidates.py", 123]);
  Vqa.find( {'question': {$exists : true, $nin : ["", "=", "\r\n", " "] } }, 'question').limit(40000).exec( function (err, entries) {
      if (err)
          res.send(err);
      else{
				 var data = { 'name': "", "children":[] };
				 for( var entry in entries){
					  //console.log(entry)
				 		buildData(data.children, entries[entry].question.match(/\b(\w+)\b/g), 0)
			 	 }
				 //console.log(data)
				 res.render('d3/index.ejs', {entries: entries, data: data})
			}
  });

}





function all(req, res) {
	//res.render('spelling/index.ejs')
	//var process = spawn('python3.6',["candidates.py", 123]);
  Cat.find( {'question': {$exists : true, $nin : ["", "=", "\r\n", " "] } }, 'question').exec( function (err, entries) {
      if (err)
          res.send(err);
      else{
				 var data = { 'name': "", "children":[] };
				 for( var entry in entries){
					  //console.log(entry)
				 		buildData(data.children, entries[entry].question.match(/\b(\w+)\b/g), 0)
			 	 }
				 //console.log(data)
				 res.render('d3/index.ejs', {entries: entries, data: data})
			}
  });
}

function buildData(data, words, index){
	//console.log(words[index]);
	//console.log(data);
	word  = words[index].toLowerCase()
	if(index==1 && word == 's') word = 'is';
	result = data.find(findName, [word])
	if(typeof result == 'undefined'){
		result = data.push({ 'name': word, "children":[] });
		result = data[result-1]
	}
	//console.log(result)

	if(index == words.length-1 || index == 5){
		find_end_result = result.children.find(findName, ["sentence_end"]);
		if(typeof find_end_result == 'undefined')
			result.children.push({ "name": "sentence_end", "size": 1});
		else
			find_end_result.size++;
	}else {
		buildData(result.children, words, index+1)
	}
	//console.log(data.length)
	//entries[entry].question.match(/\b(\w+)\b/g)
}
function findName(element) {
	if(element.name === this[0])
		return element;
}
// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    Entry.findById(id, function (err, article) {
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.json({message : err.status  + ' ' + err});
        } else {
            req.id = id;
            next();
        }
    });
});

module.exports = router;
