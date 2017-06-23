var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = pga({
	user: 'postgres',
	password: '',
	database: 'postgres',
	host: 'localhost',
	port: 5432,
	max: 10

})


app.use('/', express.static('static'));

app.use(bodyParser());

app.get('/person', funtion(request, response){

db.query('SELECT * FROM memeber;', function(error, result){
	if (error){
		console.error(error);
		response.end();
		return;
	}
	console.log(result.rows);
	response.end();
})
})
app.post('/person', function (request, response) {
	var name = request.body.name;

	db.query('INSERT INTO member (name) VALUES($1::text) RETURNING id;', [ name ],  function(error, result){
	if (error){
		console.error(error);
		response.end();
		return;
	}
	console.log(result.rows);
	response.end();
	// body...
	})
})