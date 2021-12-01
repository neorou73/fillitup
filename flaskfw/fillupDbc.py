"""
require user and database in postgresql
create user fillup with superuser password 'fillup' valid until 'infinity';
create database fillup with owner fillup;

properties and methods
"""

class psqldb:
    """
    a database connection class to use in this application
    """
    def __init__(self):
        """initiate object properties"""
        import json
        import os  
        jsonFilePath = os.getcwd() + "/api.config.default.json"
        f = open(jsonFilePath, 'r')
        jsonData = json.load(f)
        #print(jsonData)
        self.pgdbo = jsonData
        f.close()


    def connect(self):
        """
        create a connection with connection string
        """
        import psycopg2
        # use our connection values to establish a connection
        self.conn = psycopg2.connect(dbname=self.pgdbo['postgresql']['dbname'], user=self.pgdbo['postgresql']['user'], password=self.pgdbo['postgresql']['password'])
        # create a psycopg2 cursor that can execute queries
        self.cursor = self.conn.cursor()
        connectionStringEnding = self.pgdbo['postgresql']['dbname'] + ' at ' + self.pgdbo['postgresql']['host']


    def getCurrentTimestamp(self):
        try:
            self.connect()
            self.cursor.execute("""SELECT now();""")
            rows = self.cursor.fetchall()
            print(rows)
            self.conn.close()
        except Exception as e:
            print("Uh oh, can't connect. Invalid dbname, user or password?")
            print(e)
            self.conn.close()


    def hash_password(self, passwordString):
        import hashlib, json 
        h = hashlib.new('sha512_256')
        h.update(passwordString.encode('utf-8')) # mystring.encode('utf-8')
        hpw = h.hexdigest()
        print (json.dumps([passwordString, hpw]))
        return hpw


    def validateUser(self, email, passwordString):
        try:
            self.connect()
            self.cursor.execute("""SELECT * FROM people WHERE email = %s and password = %s;""", (email, self.hash_password(passwordString)))
            rows = self.cursor.fetchall()
            print(rows)
            self.conn.close()
            
            if len(rows) > 0:
                return True
            else:
                return False
        except Exception as e:
            print(e)
            return e


    def createLoginToken(self):
        import uuid 
        return uuid.uuid4().hex


    def loginUser(self, email):
        try:
            self.connect()
            self.cursor.execute("""INSERT INTO accesstokens (person, token) values (%s, %s);""", (email, self.createLoginToken()))
            print("user " + email + " has been logged in.")
            self.conn.close()
            return email
        except Exception as e:
            print(e)
            return e


if __name__ == "__main__":
    pdb = psqldb()
    pdb.getCurrentTimestamp()
    if pdb.validateUser('superuser@org.org', '1+5@secret!'):
        print ('user is valid')
        pdb.loginUser('superuser@org.org')
    else:
        print ('user is not valid')
