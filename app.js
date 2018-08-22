'use strict';



var express=require("express");
var	app = express();
app.use(express.static(__dirname ));
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/qa");
var db = mongoose.connection;
db.on("error", (err)=>{  
	console.error("connection failed error :", err);
});


db.once("open",()=>
{
	console.log("db connection successful");

});


app.use(function(req, res, next){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	if(req.method==="OPTIONS"){
		res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE");
		return res.status(200).json({}); 
	}
	next();
});

var routes = require("./routes");

var jsonParser = require("body-parser").json;
var logger = require ('morgan');

app.use(logger("dev"));
app.use(jsonParser());







app.use("/questions", routes);

// catch 404 and forward to error handler

app.use(function(req, res, next){

		var err = new Error ("Not Found")
		err.status = 404;

		next(err);

});

//Error Handler

app.use(function(err, req, res, next){
	res.status(err.status || 500);
	res.json({
		message : err.message
	});
	next();
});

 

var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log(`Server running at localhost:${port}`);
});

















