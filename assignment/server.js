const express = require('express');

var mysql = require('mysql')
var app = express()
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken')
app.set('view engine', 'ejs')

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

var conn = {
    host:'localhost',
    user:'root',
    password:'12345678',
    database:'project'
 }
 var knex = require('knex')({client:'mysql',connection:conn});

	knex.schema.hasTable('users').then(function(exists) {
	  if (!exists) {
	    knex.schema.createTable('users', function(t) {
	      t.increments('id').primary();
		  	t.string('name').notNullable();
	      t.string('email').unique().notNullable();
	      t.string('password')
	    //   return res.send('table has been created')
	    })
	    .catch((err)=>{console.log(err.message)})
	  }
	 
	});


	knex.schema.hasTable('opinion').then(function(exists){
		if (!exists){
			knex.schema.createTable('opinion', function(m){
				m.increments('opinion_id').primary();
				m.integer('user_id').notNullable();
				m.string('user_opinion').notNullable();
				console.log('table has been created')
			})
			.catch((err)=>{return res.send(err.message)})
		}
		
	});

const users = express.Router();
app.use('/',users)
require ("./users")(users, knex, jwt);

const opinion = express.Router();
app.use('/', opinion)
require ("./opinion")(opinion, knex, jwt);


app.listen(3080,()=>{
	console.log('Port is working...')
})
