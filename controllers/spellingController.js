const mongoose = require("mongoose");
const Entry = require("../schema/entry");
const router = require("express").Router();

router.get('/entries', all);
router.get('/entries/:id/original', original);

router.route("/entries/:id").get(edit).post(update);

function all(req, res) {
	//res.render('spelling/index.ejs')
	//var process = spawn('python3.6',["candidates.py", 123]);
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
