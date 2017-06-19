# all the imports
import json
from flask import Flask, request, session, g, redirect, url_for, abort, render_template, flash

def readConfig():
    import os
    sourceFile = os.path.dirname(__file__) + '/config.default.json'
    with open(sourceFile, 'r') as cf:
        output = json.load(cf)
        print(output)
        return output

configuration = readConfig()
dbConfig = configuration["fillitup"]["database"]

app = Flask(__name__)

app.secret_key = 'th1$_$@6006_k33'

# connect_str = "dbname='fillitup' user='fillitup' host='localhost' password='fillitup'" # reuse this
connect_str = "dbname='" + dbConfig['name'] + "' "
connect_str += "user='" + dbConfig['user'] + "' "
connect_str += "host='" + dbConfig['host'] + "' "
connect_str += "password='" + dbConfig['password'] + "'"

print('test connection string: ' + connect_str)

################## ROUTING SECTION ####################

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/login', methods=['GET', 'POST'])
def login():
    # return 'Login Page'
    error = None
    if request.method == 'POST':
        if validate_user_authentication(request.form['username'], request.form['password']):
            error = 'Invalid username or password'
        else:
            session['logged_in'] = True
            flash('You were logged in')
            return redirect(url_for('testing'))
    return render_template('login.html', error=error)

@app.route('/logout')
def logout():
    return 'Logging Out from Application'

@app.route('/signup')
def signup():
    return 'Signup For a New Account'

@app.route('/testing')
def testing():
    dbQuery = """SELECT * FROM appuser"""
    result = query_database(dbQuery, connect_str, None)
    """
    testing the output with the following:
    print("column names: ")
    print(result[0])
    print("actual results: ")
    print(result[1])
    """
    return 'There are ' + str(len(result[1])) + ' results'

################## REUSABLE FUNCTIONS SECTION ####################

def generate_uuid():
    import uuid
    return uuid.uuid4()

def query_database(dbQuery, connect_str, queryParam):
    """
    the value of dbQuery needs to be encapsulated between 3 double quotes 
    just like this comment
    connect_str example 
    connect_str = "dbname='fillitup' user='fillitup' host='localhost' password='fillitup'"
    """
    import psycopg2
    try:
        # use connection values to connect
        conn = psycopg2.connect(connect_str)
        cursor = conn.cursor()
        if (queryParam):
            cursor.execute(dbQuery, queryParam)
        else:
            cursor.execute(dbQuery)
        rows = cursor.fetchall()
        column_names = [rows[0] for rows in cursor.description]
        return [column_names, rows]
    except Exception as e:
        errorObject = { "message": "connection issue, unable to connect" }
        errorObject["exception"] = e
        return errorObject

def validate_user_authentication(username, password):
    try:
        dbQuery = """SELECT firstname, lastname FROM appuser WHERE email = %s AND password = md5(%s)"""
        result = query_database(dbQuery, connect_str, (username, password))
        print(result)
        if (len(result[0]) == 1):
            return True
        else:
            return False
    except Exception as e:
        errorObject = { "message": "problem querying database" }
        errorObject["exception"] = e
        return errorObject
        
