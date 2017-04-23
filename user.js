// database utility that accesses user and user related mechanisms

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
    client.query('SELECT * from t_user', [], function (err, result) {
        if (err) throw err;
        console.log(result.rows[0]);
        client.end(function (err) {
            if (err) throw err;
        });
    });
});



