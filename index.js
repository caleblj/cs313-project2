var express = require('express');
var pga = require('pga');
var app = express();
var bodyParser = require('body-parser');
const url = require('url');
var db = pga(getConfig());





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
};
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

app.get('/person', function(request, response){

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
app.listen(process.env.PORT || 3000);