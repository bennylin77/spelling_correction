const mongoose = require("mongoose");
const Entry = require("../schema/entry");
const Cat = require("../schema/cat");
const router = require("express").Router();

router.get('/cats_new', cats_new);
router.get('/cats', cats);
router.get('/cats/:id/:original/catsOriginal', catsOriginal);
router.route("/cats/:id").get(catsEdit).post(catsUpdate);
router.get('/entries', all);
router.get('/entries/:id/original', original);
router.route("/entries/:id").get(edit).post(update);



function cats_new(req, res) {
  Cat.find( { incorrect: { $gt: [] } }, function (err, cats) {
			//console.log(cats)
      if (err)
          res.send(err);
      else
	       res.render('spelling/index_new.ejs', {cats: cats})
  });
}

function cats(req, res) {
  Cat.find( { incorrect: { $gt: [] } }, function (err, cats) {
			//console.log(cats)
      if (err)
          res.send(err);
      else
	       res.render('spelling/answerIndex.ejs', {cats: cats})
  });
}

function catsOriginal(req, res){
	Cat.findById(req.id, function (err, cat) {
		if (err) return handleError(err);
		cat.incorrect = cat.incorrect.filter(function(a){ return a.toLowerCase() !== req.params.original.toLowerCase()})
		cat.save(function (err) {
				  if (err) return handleError(err);


					Cat.find({ incorrect: req.params.original.toLowerCase() }, function (err, cats) {
						if (err) return handleError(err);
							//console.log(typeof cats)
							//console.log(Object.keys(cats).length)
							var promises = cats.map(function(c) {
							  return new Promise(function(resolve, reject) {
									console.log(c)
									c.incorrect = c.incorrect.filter(function(a){ return a.toLowerCase() !== req.params.original.toLowerCase()})
									c.save(function (err) {
												if (err) return handleError(err);
												resolve();
									})
							  });
							});
							Promise.all(promises)
							.then(function() {
									Cat.find({ incorrect: req.params.original.toLowerCase() }, function (err, cs) {
										if (err) return handleError(err);
										console.log(Object.keys(cs).length)
										res.redirect('/spelling/cats');
									});
							})
							.catch(console.error);
				});
		});
	})
}
function catsEdit(req, res) {
  Cat.findById(req.id, function (err, cat) {
    if (err) {
      console.log('GET Error: There was a problem retrieving: ' + err);
    } else {
			res.render('spelling/answerEdit.ejs', {cat: cat})
    }
  });
}
function catsUpdate(req, res) {
	Cat.findById(req.id, function (err, cat) {
	  if (err) return handleError(err);
		incorrect = Array.from(new Set(incorrect))
		for( var word of incorrect ){
			lowercase_word = word.toLowerCase();
			if( req.body[lowercase_word] ){
				//console.log(cat.answers);
				cat.answers = cat.answers.map(function(x) {
					 x.answer = x.answer.toLowerCase().replace(word, req.body[lowercase_word].toLowerCase());
				   return x;
				});
				incorrect = incorrect.filter(function(a){ return a.toLowerCase() !== lowercase_word})
			}
		}
		Cat.findByIdAndUpdate(req.id, { $set: { answers: cat.answers, incorrect: incorrect }}, { new: true }, function (err, tank) {
		  if (err) return handleError(err);
		  res.redirect('/spelling/cats');
		});
	})
}


function all(req, res) {
  Entry.find( { incorrect: { $gt: [] }, updated: {$ne: true}  }, function (err, entries) {
      if (err)
          res.send(err);
      else
	       res.render('spelling/index.ejs', {entries: entries})
  });
}
function edit(req, res) {
  Entry.findById(req.id, function (err, entry) {
    if (err) {
      console.log('GET Error: There was a problem retrieving: ' + err);
    } else {
			var commands = entry.incorrect.map(function(value) {
				return getCandidates(value);
		 	});
			Promise.all(commands).then(values => {
				res.render('spelling/edit.ejs',{entry: entry, candidates: values})
			}).catch(function(e) {
  			console.log(`error: ${e}`);
			});
    }
  });
}
function getCandidates(arg){
  return new Promise(function (resolve, reject){
		var spawn = require("child_process").spawn;
		var process = spawn('python3', ["candidates.py", arg]);
		process.stdout.on('data', function (data){
			resolve( { [arg]: JSON.parse(data) } );
		});
		process.on('close', function(code){
			 if (code !== 0) {
					reject(code);
			 }
		});
  });
}

function update(req, res) {
	console.log(req.body);

	Entry.findById(req.id, function (err, entry) {
	  if (err) return handleError(err);
		console.log(entry.question );
		for( var i in entry.incorrect ){
			if( !req.body.hasOwnProperty(entry.incorrect[i]))
      	res.send("You did't choose any word");
			else{
				var newstr = entry.question.replace(entry.incorrect[i], req.body[entry.incorrect[i]]);
				entry.question = newstr;
				entry.updated = true;
				//doc.save(callback);
			}
		}
		entry.save(function (err) {
		  if (err) return handleError(err);
			Entry.find( { incorrect: { $gt: [] }, updated: {$ne: true} }, function (err, entries) {
		      if (err)
		        res.send(err);
		      else
			    	res.render('spelling/index.ejs',{entries: entries});
		  });
		});
	})
}



function original(req, res){
	Entry.findOneAndUpdate({_id: req.id}, {updated: true},
												 {new: true}, function(err, entry){
		if(err){
				console.log("Something wrong when updating data!");
		}
		Entry.find( { incorrect: { $gt: [] }, updated: {$ne: true} }, function (err, entries) {
				if (err)
					res.send(err);
				else
					res.render('spelling/index.ejs',{entries: entries});
		});
	});
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
