// database utility that accesses user and user related mechanisms

var getUsers = function(dbQuery, dbqArgs, cb) {
		
	  // const pg = require('pg');
		var config = {
				user: 'fillitup',
				database: 'fillitup',
				password: 'fillitup',
				host: 'localhost',
				port: 5432
		};
		var conString = 'postgres://' + config.user + ':' + config.password;
		conString += ':@' + config.host + ':' + config.port + '/' + config.database;
		var query = require('pg-query');
		query.connectionParameters = query;

		query(dbQuery, dbqArgs, function(err, rows, result) {
				if (err) { 
						cb(err);
				}

				cb(null, { 'rows': rows, 'result': result });
		});
};

console.log('test');

var dbQuery = 'select NOW()';
var dbqArgs = [];
getUsers(dbQuery, dbqArgs, function(err, results) {
		if (err) { 
				console.log(err); 
		}
		console.log(results);
});
