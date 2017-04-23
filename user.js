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

		var client = new pg.Client();
		client.connect(function (err) {
				if (err) throw err;

				// one query just to show it works
				client.query(dbQuery, dbqArgs, function (err, result) {
						if (err) throw err;
						// console.log(result.rows[0]);
						client.end(function (err) {
								if (err) throw err;
								cb(null, result);
						});
				});
		});
};

console.log('test');

var dbQuery = 'select * from t_user';
var dbqArgs = {};
getUsers(dbQuery, dbqArgs, function(err, results) {
		if (err) { console.log(err); }
		console.log(null, results);
});
