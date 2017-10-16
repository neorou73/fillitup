"""
require user and database in postgresql
create user fillup with superuser password 'fillup' valid until 'infinity';
create database fillup with owner fillup;

properties and methods
"""

import psycopg2

class psqlConnect:
    """
    a database connection class to use in this application
    """
    def __init__(self):
        """initiate object properties"""
        self.databaseName = 'fillup'
        self.databaseHost = 'localhost'
        self.databaseUser = 'fillup'
        self.databasePassword = 'fillup'
        self.connectString = "dbname=" + self.databaseName 
        self.connectString += " user=" + self.databaseUser
        self.connectString += " host=" + self.databaseHost
        self.connectString += " password=" + self.databasePassword

    def connect(self):
        """
        create a connection with connection string
        """
        # use our connection values to establish a connection
        self.conn = psycopg2.connect(self.connectString)
        # create a psycopg2 cursor that can execute queries
        self.cursor = self.conn.cursor()
        connectionStringEnding = self.databaseName + ' at ' + self.databaseHost
        """
        if (self.cursor):
            print('connection made to ' + connectionStringEnding)
        else:
            print('connection problem with ' + connectionStringEnding)"""
        

    def getCurrentTimestamp(self):
        try:
            self.cursor.execute("""SELECT now();""")
            rows = self.cursor.fetchall()
            #print(rows)
        except Exception as e:
            print("Uh oh, can't connect. Invalid dbname, user or password?")
            print(e)

if __name__ == "__main__":
    pc = psqlConnect()
    pc.connect()
    pc.getCurrentTimestamp()
