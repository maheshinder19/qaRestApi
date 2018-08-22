'use strict';

var express = require("express"),
	router = express.Router();

// var mongoose = require("mongoose");

var Question = require("./models").Question; 

router.param("qid", function(req, res, next, id){
	Question.findById(id, function(err, doc){
		if (err) return next(err);
		if(!doc){
			err = new Error("Not Found");
			err.status= 404;
			return next(err);
		}
		req.question= doc;
		next();
	});
});


	router.param("aid", (req, res, next, id)=>{
		req.answer = req.question.answers.id(id);
		if(!req.answer){
			err = new Error("Not found");
			err.status= 404;
			return next (err);
		}
		next();
		
	});
//get  questions
//route for all the questions

router.get("/" , (req, res, next) => {

	// Question.find({}, null, {sort : {createdAt : -1}}, function(err, questions){
	   Question.find({})
	   .sort({createdAt : -1})
	   .exec(function(err, questions){


		if(err) return next(err);

		res.json(questions);

		//next();





		});



	//res.json({response : "you sent a Get request"});
	});

//post  questions
//route for creating the questions

router.post("/" , (req, res, next) => {
			

	var question = new Question(req.body);
	
		
	question.save(function(err, questions){
		if (err) return next(err);

		res.status(201);
		
		res.json(questions);
				

	});
});

//get  questions/:id
//route for specific questions

router.get("/:qid" , (req, res ) => {
	// Question.findById(req.params.qid, function(err, doc){
	// 	if (err) return next(err);
	// 	res.json(doc);
	// });
		
	res.json(req.question);

});
	


//POST /question/:id/answers
//ROUTE for creating an answer

router.post("/:qid/answers" , (req, res, next) => {
	req.question.answers.push(req.body);
	req.question.save(function(err, question){
		
		if (err) return next(err);

		res.status(201);
		res.json(question);
		
		
	});



	// res.json({
	// 		response : "you sent a post request /answers",
	// 		questionId : req.params.qid,
	// 		body : req.body
	// });
});

//put /questions/:id/answers/:id
//edit an answer

router.put("/:qid/answers/:aid" , (req, res) => {

	req.answer.update(req.body, function(err, result){
		if (err) return next(err);
		res.json(result);
	});

// 	res.json({response : "you sent a put request to /answers",
// 			questionId : req.params.qid,
// 			answerId	: req.params.aid, 
// 			body : req.body
// });
});


//put /questions/:qid/answers/:aid
//edit an answer

router.delete("/:qid/answers/:aid" , (req, res) => {



	req.answer.remove(function(err){
			req.question.save(function(err, question){
						if (err) return next(err);
						res.json(question);


			});
	});
// 	res.json({response : "you sent a delete request to /answers",
// 			questionId : req.params.qid,
// 			answerId	: req.params.aid, 
// 			body : req.body
// });
});






//post  /questions/:qid/answers/:aid/vote-up
//post  /questions/:qid/answers/:aid/vote-down
//vote on a specific answer
router.post("/:qid/answers/:aid/vote-:dir" ,
	function(req, res, next){

	if(req.params.dir.search(/^(up|down)$/)=== -1){
		var err = new Error("Not Found");
		err.status = 404;
		 next(err); 
	}
	else{
		req.vote = req.params.dir;
		next(); 
		
	}

}, 

	function(req, res, next)  {
		req.answer.vote(req.vote, function(err, question){
			if (err) return next(err);
			res.json(question);
		});
	

});












	module.exports= router;