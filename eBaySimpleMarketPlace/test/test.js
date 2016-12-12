var request = require('request'), express = require('express'), assert = require("assert") ,http = require("http");

describe('http tests', function(){
	it('should return logIn page for correct url', function(done){
		http.get('http://localhost:3000/logIn', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});

	it('should not return page for wrong url', function(done){
		http.get('http://localhost:3000/prfle', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	it('should signup for correct details', function(done) {
		request.post(
			    'http://localhost:3000/signUp',
			    { form: {
			        "email" : "parth17pandya@gmail.com",
			        "re-email" : "parth17pandya@gmail.com",
			        "password" : "abc@12345",
			        "fname" : "Parth",
			        "lname" : "Pandya"
			    } },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });

it('should return cart page for correct url', function(done){
		http.get('http://localhost:3000/cart', function(res) {console.log(res.statusCode);
			assert.equal(200, res.statusCode);
			done();
		})
	});


	
	it('should not allow to login', function(done) {
		request.post(
			    'http://localhost:3000/logIn',
			    { form: { "username": 'hemal@sjsu.edu',"password":'aditya' } },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
});