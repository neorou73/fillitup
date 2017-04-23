// database utility that accesses user and user related mechanisms

var getUsers = function(dbQuery, dbqArgs, cb) {
		
	  const pg = require('pg');
		var config = {
				user: 'fillitup',
				database: 'fillitup',
				password: 'fillitup',
				host: 'localhost',
				port: 5432
		};
		var conString = 'postgres://' + config.user + ':' + config.password;
		conString += ':@' + config.host + ':' + config.port + '/' + config.database;
		pg.connect(conString, function(err, client, done) {
		    if (err) {
				    cb(err);
				}

				client.query(dbQuery, dbqArgs, function(err, result) {
						if (err) { 
								cb(err);
						}

						cb(null, { 'result': result });
				});
		});
};

console.log('test');

var dbQuery = 'select NOW()';
var dbqArgs = [];
getUsers(dbQuery, dbqArgs, function(err, results) {
		if (err) { 
				console.log(err); 
		}
		console.log(JSON.stringify(results));
		process.exit(0);
});
