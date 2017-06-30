var express = require('express');
var pga = require('pga');
var app = express();
var bodyParser = require('body-parser');
const url = require('url');
var db = pga(getConfig());
console.log(getConfig());





function getConfig(){
if(process.env.DATABASE_URL){
const params = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(':');

return {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
  ssl: true
}
}


return 	{
	user: 'postgres',
	password: process.env.DB_PASS,
	database: 'postgres',
	host: 'localhost',
	port: 5433,
	max: 10
	};
}

app.use('/', express.static('static'));

app.use(bodyParser());

app.get('/chores', function(request, response){
	db.query('SELECT * from chore;', function(error, result){
	if (error){
		console.error(error);
		response.end();
		return;
	}
	response.json(result.rows);



})
})

app.get('/chores/:id', function(request, response){
	db.query('SELECT * from chore WHERE id = $1::int LIMIT 1;', [ request.params.id ] ,function(error, result){
	if (error){
		console.error(error);
		response.end();
		return;
	}
	response.json(result.rows[0]);



})
})



app.get('/person', function(request, response){

db.query('SELECT * FROM person;', function(error, result){
	if (error){
		console.error(error);
		response.end();
		return;
	}
	response.json(result.rows);
	response.end();
})
})
app.post('/person', function (request, response) {
	var name = request.body.name;

	db.query('INSERT INTO person (name) VALUES($1::text) RETURNING id;', [ name ],  function(error, result){
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
app.listen(process.env.PORT || 3000);