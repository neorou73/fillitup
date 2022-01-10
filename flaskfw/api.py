from flask import Flask, render_template, request, make_response, redirect, abort, session, jsonify, url_for
from flask.helpers import send_from_directory  
from markupsafe import escape, Markup
from datetime import datetime

import os, json, sys, shutil  

def readConfigurationFile():
    try:
        print("attempting to read configuration...")
        jsonFilePath = os.getcwd() + "/api.config.default.json"
        f = open(jsonFilePath, 'r')
        jsonData = json.load(f)
        f.close()
        return jsonData
    except Exception as e:
        print('unable to read configuration file - please ensure file exists and properly formatted.')
        sys.exit()

configurationObject = readConfigurationFile()
print("read configuration file")
#print(configurationObject['application']['secret_key'])

fileUploadDirectoryPath = os.path.dirname(os.path.realpath(__file__)) + "/static/fileuploads"
if not os.path.exists(fileUploadDirectoryPath):
    print("created new upload directory: ", fileUploadDirectoryPath)
    os.makedirs(fileUploadDirectoryPath)
else:
    print("upload directory already exists: ", fileUploadDirectoryPath)

cachedDirectoryPath = os.path.dirname(os.path.realpath(__file__)) + "/static/cached"
if not os.path.exists(cachedDirectoryPath):
    print("created new cached files directory: ", cachedDirectoryPath)
    os.makedirs(cachedDirectoryPath)
else:
    print("cached files directory already exists: ", cachedDirectoryPath)

backupDirectoryPath = os.path.dirname(os.path.realpath(__file__)) + "/backup"
if not os.path.exists(backupDirectoryPath):
    print("created new backup directory: ", backupDirectoryPath)
    os.makedirs(backupDirectoryPath)
else:
    print("backup directory already exists: ", backupDirectoryPath)

defaultCssFile = os.path.dirname(os.path.realpath(__file__)) + "/static/style.css"
cachedCssFile = os.path.dirname(os.path.realpath(__file__)) + "/static/cached/style.css"
if not os.path.exists(cachedCssFile):
    print("copied default css file to cached version: ", cachedCssFile)
    shutil.copyfile(defaultCssFile, cachedCssFile)
else:
    print("cached css file already exists: ", cachedCssFile)

app = Flask(__name__)
app.secret_key = bytes(configurationObject['application']['secret_key'], 'utf-8')

#url_for('static', filename='style.css')

"""
instantiate database interface object
"""
sys.path.append(".")
from fillupDbc import psqldb 
pdb = psqldb()
pdb.getCurrentTimestamp()
pdb.connect()

@app.route("/")
@app.route("/auth")
@app.route("/manage")
@app.route("/manage/<path:text>")
@app.route("/users")
@app.route("/users/<path:text>")
@app.route("/editor")
@app.route("/editor/<path:text>")
@app.route("/read")
@app.route("/read/<path:text>")
@app.route("/uploads")
@app.route("/uploads/<path:text>")
@app.route("/keywords")
@app.route("/keywords/<path:text>")
@app.route("/me")
@app.route("/me/<path:text>")
@app.route("/blog/<path:text>")

def output_frontend(text=None):
    return send_from_directory('static', 'index.html')

@app.route('/hello/<name>')
def hello(name=None):
    if 'email' in session:
        return render_template('hello.html', name=session['email'], loggedin=True)
    return render_template('hello.html', name=name, loggedin=False)
    #return "<p>Hello, World!</p>"

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        print(request.json['email'])
        print(request.json['password'])
        if pdb.validateUser(request.json['email'], request.json['password']):
            print ('user is valid')
            tokenString = pdb.loginUser(request.json['email']) 
            if tokenString is not False:
                session['email'] = request.json['email']
                session['accesstoken'] = tokenString
                return jsonify(session)
            else:
                session.pop('email', None)
                session.pop('accesstoken', None)
            errorObject = { "code": 401, "error": "Unauthorized", "description": "This user is not valid" }
            return jsonify(errorObject)
        else:
            enotice = "user is not valid"
            print (enotice)
            error=enotice
            session.pop('email', None)
            session.pop('accesstoken', None)
            errorObject = { "code": 401, "error": "Unauthorized", "description": "This user is not valid" }
            return jsonify(errorObject)
        
    #return render_template('login.html', error=error, loggedin=True)

@app.route('/logout')
def logout():
    # remove the username from the session if it's there
    #print(session['email'])
    #print(session['accesstoken'])
    if session.get("email") == None and session.get("accesstoken" == None):
        pdb.logoutUser(session['email'])
        session.pop('email', None)
        session.pop('accesstoken', None)
    return jsonify({ 'loggedout': True }) 

@app.route('/whoami')
def whoami():
    print(session.get("email"))
    if session.get("email") == None:
        return jsonify({ 'loggedout': True })
    else: 
        return jsonify({ 'loggedout': False, "sessionemail": session.get("email"), "sessiontoken": session.get("accesstoken")})

@app.route('/api/upload', methods=['GET', 'POST'])
def upload_file():
    if 'email' in session:
        if request.method == 'POST':
            f = request.files['file1']
            #print(f)
            #print(f.content_type)
            #print(f.filename)
            #filename = "getname"
            f.save(fileUploadDirectoryPath + '/' + f.filename)
        
        return render_template('upload.html')
    return redirect(url_for('hello'))

#@app.route('/editor', methods=['GET', 'POST'])
@app.route('/api/editor/<postTitle>', methods=['GET', 'POST'])
#def use_editor(postTitle=None):
def use_editor(postTitle):
    if 'email' in session:
        #if request.method == "POST" and hasattr(request.form, 'title'):
        # get content data based on title 
        htmlContentData = pdb.getContent(postTitle)
        #print(htmlContentData)
        if request.method == "POST" and htmlContentData is None:
            #print(request.form['title'])
            #print(request.form['content'])
            results = pdb.createContent(postTitle, request.form['content'])
            if not(results):
                print('insert did not happen')
                return render_template('editor.html', title=postTitle)
            return render_template('editor.html', title=postTitle, content=request.form['content'])
        elif request.method == "POST" and htmlContentData is not None:
            results = pdb.updateContent(postTitle, request.form['content'])
            if not(results):
                print('insert did not happen')
                return render_template('editor.html', title=postTitle)
            return render_template('editor.html', title=postTitle, content=request.form['content'])
        elif request.method == "GET" and htmlContentData is not None:
            return render_template('editor.html', title=postTitle, content=htmlContentData[2])
        else:
            return render_template('editor.html', title=postTitle)

    return redirect(url_for('hello'))

@app.route('/api/read')
@app.route('/api/read/<postTitle>')
def read_content(postTitle=None):
    if postTitle:
        htmlContentData = pdb.getContent(postTitle)
        #print(escape(htmlContentData[2]))
        if htmlContentData is not None:
            return render_template('read.html', title=postTitle, content=htmlContentData[2])
        return render_template('read.html', title=postTitle)
    listall = pdb.getAllContents()
    #print(len(listall))
    return render_template('read.html', listall=listall)

@app.route('/api/manage')
def manage_site():
    error = None
    if 'email' in session:
        return render_template('manage.html')
    return redirect(url_for('hello'))

### JSON values returned for these management calls
@app.route('/api/users/add', methods=['POST'])
def add_user():
    if request.method == "POST":
        #print(request.json)
        userData = {}
        userData['username'] = request.json['username']
        userData['hashedPassword'] = pdb.hash_password(request.json['password'])
        userData['email'] = request.json['email']
        #print(userData)
        if pdb.createUser(userData):
            return jsonify(userData)
        else:
            errorObject = { "code": 400, "error": "Bad Request", "description": "Unable to process HTTP Request" }
            return jsonify(errorObject)

@app.route('/api/users/list')
def list_users():
    data = pdb.getUsers()
    #print(data)
    try:
        returnObject = []
        for k in data:
            row = {}
            row['id'] = k[0]
            row['email'] = k[1]
            row['name'] = k[2]
            row['created'] = k[3]
            returnObject.append(row)
        return jsonify(returnObject)
    except:
        return jsonify({ "error": [500, "Internal Server Error", "unable to get keywords"]})


@app.route('/api/users/edit', methods=['POST'])
def edit_user():
    if request.method == "POST":
        userData = {
            'username': request.form['username'],
            'password': pdb.hash_password(request.form['password']),
            'email': request.form['email']
        }
        #print(userData)
        if pdb.editUser(userData):
            return jsonify([userData['username'], userData['email']])
        else:
            errorObject = { "code": 400, "error": "Bad Request", "description": "Unable to process HTTP Request" }
            return jsonify(errorObject)

@app.route('/api/users/deactivate', methods=['POST'])
def deactivate_user():
    if request.method == "POST":
        if pdb.editUser(request.form('email'), "deactivate"):
            return jsonify({ "email": request.form('email')})
        else:
            errorObject = { "code": 400, "error": "Bad Request", "description": "Unable to process HTTP Request" }
            return jsonify(errorObject)

@app.route('/api/users/purge', methods=['POST'])
def purge_user():
    if request.method == "POST":
        if pdb.editUser(request.form('email'), "purge"):
            return jsonify({ "email": request.form('email')})
        else:
            errorObject = { "code": 400, "error": "Bad Request", "description": "Unable to process HTTP Request" }
            return jsonify(errorObject)

@app.route('/api/fileuploads/list')
def list_fileuploads():
    data = pdb.getFileUploads()
    #print(data)
    try:
        returnObject = []
        for k in data:
            row = {}
            row['id'] = k[0]
            row['filename'] = k[1]
            row['fullpath'] = k[2]
            row['filetype'] = k[3]
            row['tscreated'] = k[4]
            row['published'] = k[5]
            returnObject.append(row)
        return jsonify(returnObject)
    except:
        return jsonify({ "error": [500, "Internal Server Error", "unable to get keywords"]})

@app.route('/api/fileuploads/create', methods=['POST'])
def create_fileupload():
    tddt = datetime.now()
    yyyymm = tddt.strftime("%Y%m")
    from pathlib import Path
    ymDir = fileUploadDirectoryPath + '/' + yyyymm
    ymDirPath = Path(ymDir)
    ymDirPath.mkdir(parents=True, exist_ok=True) 
    #print(tddt.strftime("%Y%m"))
    # requires processing of file upload and copy to upload directory
    uploadedFile = request.files['file']
    #print(dir(uploadedFile))
    localTarget = ymDir + '/' + uploadedFile.filename
    uploadedFile.save(os.path.join(ymDir, uploadedFile.filename))
    uploadData = {
        "filename": uploadedFile.filename,
        "fullpath": localTarget,
        "filetype": uploadedFile.content_type 
    }
    # available uploadedFile object keys are lastModified, lastModifiedDate, name, size, type, webkitRelativePath
    return jsonify(pdb.createFileUpload(uploadData))

@app.route('/api/htmlcontents/list')
def get_htmlcontents():
    data = pdb.getHtmlContents()
    #print(data)
    try:
        returnObject = []
        for k in data:
            row = {}
            row['id'] = k[0]
            row['title'] = k[1]
            row['created'] = k[2]
            row['meta'] = k[3]
            row['published'] = k[4]
            returnObject.append(row)
        return jsonify(returnObject)
    except:
        return jsonify({ "error": [500, "Internal Server Error", "unable to get keywords"]})

@app.route('/api/htmlcontents/get/<title>')
def get_htmlcontent(title):
    hct = pdb.getHtmlContent(title)
    #print(hct)
    try:
        returnObject = { 'id': hct[0], 'title': hct[1], 'content': hct[2], 'markdownst': hct[3], 'meta': hct[4], 'published': hct[5] }
        return jsonify(returnObject)
    except:
        errorObject = { "code": 404, "error": "Not Found", "description": "This HTML Content has not been created yet", "object": sys.exc_info() }
        return jsonify(errorObject)

@app.route('/api/htmlcontents/save', methods=['POST'])
def create_htmlcontent():
    #print(request.json)
    return jsonify(pdb.createHtmlContent(request.json['title'], request.json['content'], request.json['markdownst'], request.json['meta'], request.json['published']))

@app.route('/api/htmlcontents/update', methods=['POST'])
def update_htmlcontent():
    #print(request.json)
    return jsonify(pdb.updateHtmlContent(request.json['title'], request.json['content'], request.json['markdownst'], request.json['meta'], request.json['published']))

@app.route('/api/keywords/list')
def list_keywords():
    data = pdb.getKeywords()
    #print(data)
    try:
        returnObject = []
        for k in data:
            row = {}
            row['id'] = k[0]
            row['name'] = k[1]
            row['description'] = k[2]
            row['created'] = k[3]
            returnObject.append(row)
        return jsonify(returnObject)
    except:
        return jsonify({ "error": [500, "Internal Server Error", "unable to get keywords"]})

@app.route('/api/keywords/create', methods=['POST'])
def create_keyword():
    keywordData = {
        'name': request.json['name'], 
        'description': request.json['description']
    }
    return jsonify(pdb.createKeyword(keywordData))

@app.route('/api/keywords/remove', methods=['POST'])
def remove_keyword():
    return jsonify(pdb.removeKeyword(request.form('keyword')))

