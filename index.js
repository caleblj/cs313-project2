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



app.get('/assignChore', function(request, response){
	db.transact([
		db.sql`SELECT id, name FROM person;`,
		db.sql`SELECT id, name FROM chore;`
		] , function(error, result){
	if (error){
		console.error(error);
		response.end();
		return;
	}

	var personRows = result[0].rows,
		choreRows = result[1].rows;
	response.header('Content-Type', 'text/html');
	response.write('<form action="/api/assignChore" method="post">');

response.write('<select name="person">');
for (var i = 0; i < personRows.length; i++){
	response.write('<option value="'+ personRows[i].id +'">' + personRows[i].name + '</option>');
}
response.write('</select>');


response.write('<select name="chore">');
for (var i = 0; i < choreRows.length; i++){
	response.write('<option value="'+ choreRows[i].id +'">' + choreRows[i].name + '</option>');
}
response.write('</select>');


	response.write('<button>Assign</button>');
	response.write('</form>');	
	response.end();
	})
})


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


app.get('/person/:id/chores', function(request, response){
	db.query(`SELECT p.*, c.* FROM person p
		INNER JOIN chore_assignment ca ON p.id = ca.person_id
		INNER JOIN chore c ON ca.chore_id = c.id WHERE p.id = $1::int;`, [request.params.id], function (error, result){
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

app.post('/api/chores', function (request, response) {
	var name = request.body.name;

	db.query('INSERT INTO chore (name) VALUES($1::text) RETURNING id;', [ name ],  function(error, result){
	if (error){
		console.error(error);
		response.end();
		return;
	}
	console.log(result.rows);
	response.end();
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
	})
})
app.listen(process.env.PORT || 3000);