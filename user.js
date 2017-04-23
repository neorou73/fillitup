// database utility that accesses user and user related mechanisms

var getUsers = function(dbQuery, dbqArgs, cb) {
		
	  const pg = require('pg');
	  var appConfig = require('./appConfig.json');
		var config = appConfig['database'];
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

/*user:
    * create user
    * delete user
    * update user
    * read user
    * update password
    * update email
    * activate user
    * deactivate user
    * add user to group
    * remove user from group

*/

var queryStatement = {
		'createUser': 'insert into t_user (name, username, password, email, created, status) values ($1, $2, $3, $4, $5, $6)',
		'deleteUser': 'delete from t_user where id = $1',
		'updateUser': 'update t_user set name = $1, password = $2, email = $3, status = $4 where id = $5',
		'readUser': 'select * from t_user where email = $1'
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
