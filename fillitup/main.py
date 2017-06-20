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

app.secret_key = configuration["fillitup"]["application-secret-key"] # the secret key for the app sessions

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
            # error = 'Invalid username or password'
            session['accesstoken'] = create_access_token(userid)
            session['logged_in'] = True
            flash('You were logged in')
            return redirect(url_for('testing'))
        else:
            error = 'Invalid username or password'
    return render_template('login.html', error=error)

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    flash('You were logged out')
    return redirect(url_for('login'))

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    error = None
    if request.method == 'POST':
        newuser = create_new_user(request.form['firstname'], request.form['lastname'], request.form['email'], request.form['timezone'], request.form['password1'], request.form['password2'])
        return redirect(url_for('login'))
    return render_template('signup.html')

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
    # return 'There are ' + str(len(result[1])) + ' results'
    return render_template('testing.html', users=result[1])

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
    import psycopg2, psycopg2.extras
    try:
        # use connection values to connect
        conn = psycopg2.connect(connect_str)
        cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
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
        if (len(result[1]) == 1):
            return True
        else:
            return False
    except Exception as e:
        errorObject = { "message": "problem querying database" }
        errorObject["exception"] = e
        return errorObject

def create_new_user(firstname, lastname, email, timezone, password1, password2):
    try:
        if password1 == password2:
            print('passwords match')
            import psycopg2
            conn = psycopg2.connect(connect_str)
            cursor = conn.cursor()
            dbQuery = """SELECT * FROM newappuser(%s, %s, %s, %s, %s)"""
            result = cursor.execute(dbQuery, (timezone, email, password1, lastname, firstname))
            dbQuery2 = """SELECT firstname, lastname FROM appuser WHERE email = %s"""
            result2 = cursor.execute(dbQuery2, (email))
            print(result2)
            return email 
        else:
            errorObject = { "message": "problem creating a new user account" }
            return errorObject 
    except Exception as e:
        errorObject = { "message": "problem creating a new user account" }
        errorObject["exception"] = e
        return errorObject

def create_access_token(userid):
    try:
        accesstoken = generate_uuid()
        dbQuery = """INSERT INTO accesstoken (token, created, appuser) VALUES (%s, now(), %s)"""
        result = query_database(dbQuery, connect_str, (accesstoken, userid))
        return accesstoken
    except Exception as e:
        errorObject = { "message": "problem generating or storing accesstoken" }
        errorObject["exception"] = e
        return errorObject

