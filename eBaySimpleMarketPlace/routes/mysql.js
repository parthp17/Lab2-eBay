var ejs = require('ejs');
var mysql = require('mysql');
var sem = require('semaphore')(10);
var connectionpool = [];
var maxPoolSize = 10;

function getConnection()
{
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : 'root',
	database : 'eBay',
	port : '3306'
});
return connection;
}

function createPool(){
    console.log("Connection Pool is creaated");
    for(var i=0;i<maxPoolSize;i++){
        connectionpool.push(getConnection());
    }
}

function sendToPool(callback, sqlQuery){
	sem.take(function(){
		var connection = connectionpool.pop();
		connection.query(sqlQuery,function(err, rows, fields)
				{
				if(err)
					{
					console.log("Error :: " + err.message);
					}
				else
					{
						console.log("DB results : " + rows);
						callback(err, rows);
					}
				});
				console.log("\n Connection back to pool");
				connectionpool.push(connection);
			    sem.leave();
	});
}


function getData(callback, sqlQuery)
{
	console.log("\nSql Query :: " + sqlQuery);
	
	var connection = getConnection();
	connection.query(sqlQuery,function(err, rows, fields)
	{
	if(err)
		{
		console.log("Error :: " + err.message);
		}
	else
		{
			console.log("DB results : " + rows);
			callback(err, rows);
		}
	});
	console.log("\n Connection closed");
	connection.end();
}

exports.getData = getData;
exports.createPool=createPool;
exports.sendToPool=sendToPool;