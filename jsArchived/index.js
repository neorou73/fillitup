var express = require('express');
var bodyParser = require('body-parser');
var appConfig = require('./appConfig.json'); // this is a configuration file
var app = express()
var appPort = appConfig.port
var appName = appConfig.name
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.send('Hello ' + appName  + '! You can use the <a href="/pub/index.html">client interface</a>.')
})

/**
 * create, read, update, delete user account
 * no ACL control exists yet
 * for now we want basic routing established
 */
// list all users found in database
app.get('/user/', function(req, res) {
    var sqlite3 = require('sqlite3').verbose();
    var dbFile = 'app.db';
    var db = new sqlite3.Database(dbFile);
    var output;
    db.all("SELECT firstname, lastname, email, created FROM user ORDER BY created DESC", function(err, queryResult) {
        db.close();
        res.send(queryResult);
    });
});

// use the url to get a specific user by email address
app.get('/user/:userEmail', function(req, res) {
    res.send('user requested ' + req.params.userEmail);
});

// this url will create or update the user
app.post('/user/', function(req, res) {
    // var postData = JSON.stringify(req.body);
    // res.send(req.body);
    console.log('post data: ');
    console.log(req.body);
    // validate userData
    var userData = {
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashPassword(req.body.password)
    };
    // enter userData into database
    var sqlite3 = require('sqlite3').verbose();
    var dbFile = 'app.db';
    var db = new sqlite3.Database(dbFile);
    // create statement object, then bind it
    var dbQuery = 'INSERT INTO user (username, firstname, lastname, email, password, active, locked, created) VALUES (?,?,?,?,?,1,0,CURRENT_TIMESTAMP)';
    var stmt = db.prepare(dbQuery);
    stmt.run([req.body.username,req.body.firstname,req.body.lastname,req.body.email,hashPassword(req.body.password)]);
    stmt.finalize();
    db.close();
    console.log('done');
    res.send(req.body);
});

app.post('/user/:userEmail/delete', function(req, res) {
    // check if user exists, if not create it
    res.send('user deleted ' + req.params.userEmail);
});

app.post('/user/login', function(req, res) {
    var userLogin = {
        email: req.body.email,
        password: hashPassword(req.body.password)
    };
    console.log(userLogin);
    // find userData in database
    var sqlite3 = require('sqlite3').verbose();
    var dbFile = 'app.db';
    var db = new sqlite3.Database(dbFile);
    var resultsObject = {};
    // create statement object, then bind it
    var dbQuery = 'SELECT * FROM user WHERE email = "' + userLogin.email + '" AND password = "' + userLogin.password + '"';
    // console.log(dbQuery);
    db.all(dbQuery, function(err, rows) {
        if (err) {
            console.log(err);
            resultsObject['error'] = err;
        } else {
            var uuid4 = require('uuid4');
            var token = uuid4(); // should save this token into login table
            resultsObject["accessToken"] = token;
            resultsObject["dbresults"] = {
                email: rows[0].email,
                firstname: rows[0].firstname,
                lastname: rows[0].lastname,
                username: rows[0].username,
                created: rows[0].created
            };
            dbQuery2 = 'INSERT INTO useractivity (loggedon, email, accesstoken) values (CURRENT_TIMESTAMP, ?,?)';
            var stmt = db.prepare(dbQuery2);
            stmt.run([userLogin.email, resultsObject.accessToken]);
            stmt.finalize();
            console.log(resultsObject);
        }
        res.send(resultsObject);
    });
    db.close();
});

app.post('/user/logout', function(req, res) {
    var accessToken = req.body.accessToken;
    // delete accessToken from database
    var sqlite3 = require('sqlite3').verbose();
    var dbFile = 'app.db';
    var db = new sqlite3.Database(dbFile);
    var dbQuery = 'DELETE FROM useractivity WHERE accesstoken = ?';
    var stmt = db.prepare(dbQuery);
    stmt.run([accessToken]);
    stmt.finalize();
    var resultsObject = { code: 200, status: "OK", message: "Delete Successful" };
    res.send(resultsObject);
});

app.get('/test/password/:passwordString', function(req, res) {
    console.log(req.params.passwordString);
    hashPassword(req.params.passwordString, function(err, hashedPassword) {
        if (err) {
            res.send(err);
        } else {
            // check the password
            res.send('hashed password: ' + hashedPassword);
        }
    });
});

app.get('/test/uuid4/', function(req, res) {
    genr8AccessToken(function(err, at) {
        if (err) { res.send(err); }
        else {
            res.send(at);
        }
    });
});

// allow static files to be served via relatively set static directory
var path = require('path');
// serve static files
app.use('/pub/', express.static(path.join(__dirname, 'static')));

app.listen(appPort, function () {
    console.log('Example app listening on port ' + appPort +'!')
})

// hash password
var hashPassword = function(userPassword) {
    if (userPassword == '' || !userPassword || userPassword.length < 8 || userPassword.length > 20) {
        cb({
            status: 'Precondition Required',
            code: 428,
            message: 'requires a valid user password, ' + userPassword + ' not a valid user password'});
    }
    else {
        const crypto = require('crypto');
        const hash = crypto.createHash('sha512');
        hash.update(userPassword);
        return hash.digest('hex');
    }
};

// generate uuid4 based access token
var genr8AccessToken = function(cb) {
    var uuid4 = require('uuid4');
    cb(null, uuid4());
}
