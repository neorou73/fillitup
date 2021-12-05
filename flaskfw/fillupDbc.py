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
            import uuid 
            tokenString = uuid.uuid4().hex
            print(tokenString)
            self.cursor.execute("""INSERT INTO accesstokens (person, token) values (%s, %s);""", (email, tokenString))
            self.conn.commit()
            print("user " + email + " has been logged in.")
            self.conn.close()
            return tokenString
        except Exception as e:
            print(e)
            return False
    
    def logoutUser(self, email):
        try:
            self.connect()
            self.cursor.execute("""UPDATE accesstokens SET loggedout = 'true' WHERE person = %s;""", (email,))
            self.conn.commit()
            print("user " + email + " has been logged out.")
            self.conn.close()
            return True
        except Exception as e:
            print(e)
            return False
    
    def createUser(self, userData):
        try:
            self.connect()
            self.cursor.execute("""INSERT INTO people (username, email, password) values (%s, %s, %s);""", (userData.username, userData.email, userData.hashedPassword))
            self.conn.commit()
            self.conn.close()
            return True
        except Exception as e:
            print(e)
            return False

    def editUser(self, userData, clause=None):
        # clause indicates whether it is for deactivation, password change, or any change - default is change all with email as indicator
        try:
            self.connect()
            if clause == 'passwordReset':
                self.cursor.execute("""UPDATE people SET password = %s WHERE email = %s;""", (userData.hashedPassword, userData.email))
            elif clause == 'deactivation':
                self.cursor.execute("""UPDATE people SET deactivated = 'true' WHERE email = %s;""", (userData.email))
            else:
                self.cursor.execute("""UPDATE people SET username = %s, email = %s, password = %s, deactivated = %s WHERE email = %s""", (userData.username, userData.email, userData.hashedPassword, userData.activationStatus, userData.email))
            self.conn.commit()
            self.conn.close()
            return True
        except Exception as e:
            print(e)
            return False
        

    def getUsers(self, userEmail=None):
        # if no userEmail, get all users 
        try:
            self.connect()
            if userEmail:
                self.cursor.execute("""SELECT id, email, username, tscreated FROM people WHERE email = (%s);""", (email,))
            else:
                self.cursor.execute("""SELECT id, email, username, tscreated FROM people order by email;""")
            rows = self.cursor.fetchall()
            print(rows)
            self.conn.close()
            
            if len(rows) > 0:
                return rows
            else:
                return False
        except Exception as e:
            print(e)
            return e

    def purgeUser(self, userEmail):
        try:
            self.connect()
            self.cursor.execute("""DELETE FROM people WHERE email = %s AND id != 1 CASCADE;""", (userData.email))
            self.conn.commit()
            self.conn.close()
            return True
        except Exception as e:
            print(e)
            return False

    def getSections(self, sectionName=None):
        # of mpt sectionName, get all sections 
        try:
            self.connect()
            if sectionName:
                self.cursor.execute("""SELECT * FROM sections WHERE name = (%s);""", (sectionName,))
            else:
                self.cursor.execute("""SELECT * FROM sections order by id;""")
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

    def createSection(self, sectionData):
        try:
            self.connect()
            self.cursor.execute("""INSERT INTO sections (name, description) values (%s, %s);""", (sectionData.name, sectionData.description))
            self.conn.commit()
            self.conn.close()
            return True
        except Exception as e:
            print(e)
            return False

    def editSection(self, sectionData):
        try:
            self.connect()
            self.cursor.execute("""UPDATE sections SET name = %s, description = %s, metadata = %s where name = %s);""", (sectionData.name, sectionData.description, sectionData.metadata, sectionData.name))
            self.conn.commit()
            self.conn.close()
            return True
        except Exception as e:
            print(e)
            return False

    def removeSection(self, sectionName):
        try:
            self.connect()
            self.cursor.execute("""DELETE FROM sections where name = %s);""", (sectionName,))
            self.conn.commit()
            self.conn.close()
            return True
        except Exception as e:
            print(e)
            return False

    def getKeywords(self):
        try:
            self.connect()
            self.cursor.execute("""SELECT * FROM keywords order by id;""")
            rows = self.cursor.fetchall()
            self.conn.close()
            
            if len(rows) > 0:
                return True
            else:
                return False
        except Exception as e:
            print(e)
            return e

    def createKeyword(self, keywordData):
        try:
            self.connect()
            self.cursor.execute("""INSERT INTO keywords (name, description) values (%s, %s);""", (keywordData.name, keywordData.description))
            self.conn.commit()
            self.conn.close()
            return True
        except Exception as e:
            print(e)
            return False

    def removeKeyword(self, keyword):
        try:
            self.connect()
            self.cursor.execute("""DELETE FROM keywords where name = %s);""", (keyword,))
            self.conn.commit()
            self.conn.close()
            return True
        except Exception as e:
            print(e)
            return False
    
    def createContent(self, title, content):
        try:
            self.connect()
            metadata = '{ "keywords": ["general"] }'
            self.cursor.execute("""insert into htmlcontent (title, content, meta) values (%s, %s, %s);""", (title, content, metadata))
            self.conn.commit()
            print("new html content saved")
            self.conn.close()
            return True 
        except Exception as e:
            print(e)
            return False
    
    def updateContent(self, title, content):
        try:
            self.connect()
            metadata = '{ "keywords": ["general"] }'
            self.cursor.execute("""update htmlcontent set content = (%s) where title = (%s);""", (content, title))
            self.conn.commit()
            print("existing html content saved")
            self.conn.close()
            return True 
        except Exception as e:
            print(e)
            return False
    
    def getContent(self, title):
        try:
            self.connect()
            self.cursor.execute("""select id, title, content from htmlcontent where title = (%s);""", (title,))
            rows = self.cursor.fetchone()
            self.conn.close()
            return rows 
        except Exception as e:
            print(e)
            return e
    
    def getAllContents(self):
        try:
            self.connect()
            self.cursor.execute("""select id, title, to_char(tscreated, 'Mon DD, YYYY HH:mm:ss') as stringdate, meta, published from htmlcontent order by title;""")
            rows = self.cursor.fetchall()
            self.conn.close()
            return rows 
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
