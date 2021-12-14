from flask import Flask, render_template, request, make_response, redirect, abort, session, jsonify, url_for
from flask.helpers import send_from_directory  
from markupsafe import escape, Markup

import os, json, sys  

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

app = Flask(__name__)
app.secret_key = bytes(configurationObject['application']['secret_key'], 'utf-8')

#url_for('static', filename='style.css')

fileUploadDirectoryPath = os.path.dirname(os.path.realpath(__file__)) + "/static/fileuploads"
print(fileUploadDirectoryPath)

"""
instantiate database interface object
"""
sys.path.append(".")
from fillupDbc import psqldb 
pdb = psqldb()
pdb.getCurrentTimestamp()

@app.route("/")
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
    error = None
    print(request.form)
    if request.method == 'POST':
        print(request.form['email'])
        print(request.form['password'])
        if pdb.validateUser(request.form['email'], request.form['password']):
            print ('user is valid')
            tokenString = pdb.loginUser(request.form['email']) 
            if tokenString is not False:
                session['email'] = request.form['email']
                session['accesstoken'] = tokenString
                return jsonify(session)
            else:
                session.pop('email', None)
                session.pop('accesstoken', None)
                #resp = make_response(render_template('error.html', code=401), 401)
                return jsonify({ 'error': { 'code': 401 }})
        else:
            enotice = "user is not valid"
            print (enotice)
            error=enotice
            session.pop('email', None)
            session.pop('accesstoken', None)
            return jsonify({ 'error': { 'code': 401 }})
        
    #return render_template('login.html', error=error, loggedin=True)

@app.route('/logout')
def logout():
    # remove the username from the session if it's there
    print(session['email'])
    print(session['accesstoken'])
    if pdb.logoutUser(session['email']):
        session.pop('email', None)
        session.pop('accesstoken', None)
        return jsonify({ 'loggedout': True })
    else:
        return jsonify({ 'loggedout': False, 'error': { 'code': 400 }})


@app.route('/api/upload', methods=['GET', 'POST'])
def upload_file():
    if 'email' in session:
        if request.method == 'POST':
            f = request.files['file1']
            print(f)
            print(f.content_type)
            print(f.filename)
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
        print(htmlContentData)
        if request.method == "POST" and htmlContentData is None:
            print(request.form['title'])
            print(request.form['content'])
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
        print(escape(htmlContentData[2]))
        if htmlContentData is not None:
            return render_template('read.html', title=postTitle, content=htmlContentData[2])
        return render_template('read.html', title=postTitle)
    listall = pdb.getAllContents()
    print(len(listall))
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
        userData = {}
        userData['username'] = request.form['username']
        userData['hashedPassword'] = pdb.hash_password(request.form['password'])
        userData['email'] = request.form['email']
        print(userData)
        if pdb.createUser(userData):
            return jsonify(userData)
        else:
            resp = make_response(render_template('error.html', code=400), 400)
            #resp.headers['X-Something'] = 'A value'
            return resp


@app.route('/api/users/list')
def list_users():
    
    data = pdb.getUsers()
    print(data)
    returnObject = []
    for k in data:
        row = {}
        row['id'] = k[0]
        row['email'] = k[1]
        row['name'] = k[2]
        row['created'] = k[3]
        returnObject.append(row)
    return jsonify(returnObject)


@app.route('/api/users/edit', methods=['POST'])
def edit_user():
    if request.method == "POST":
        userData = {
            'username': request.form('username'),
            'password': pdb.hash_password(request.form('password')),
            'email': request.form('email')
        }
        print(userData)
        if pdb.editUser(userData):
            return jsonify([userData['username'], userData['email']])
        else:
            resp = make_response(render_template('error.html', code=400), 400)
            #resp.headers['X-Something'] = 'A value'
            return resp

@app.route('/api/users/deactivate', methods=['POST'])
def deactivate_user():
    if request.method == "POST":
        if pdb.editUser(request.form('email'), "deactivate"):
            return jsonify({ "email": request.form('email')})
        else:
            resp = make_response(render_template('error.html', code=400), 400)
            #resp.headers['X-Something'] = 'A value'
            return resp

@app.route('/api/users/purge', methods=['POST'])
def purge_user():
    if request.method == "POST":
        if pdb.editUser(request.form('email'), "purge"):
            return jsonify({ "email": request.form('email')})
        else:
            resp = make_response(render_template('error.html', code=400), 400)
            #resp.headers['X-Something'] = 'A value'
            return resp

@app.route('/api/fileuploads/list')
def list_fileuploads():
    return jsonify(pdb.getFileUploads())

@app.route('/api/fileuploads/create', methods=['POST'])
def create_fileupload():
    # requires processing of file upload and copy to upload directory
    uploadedFile = request.files['file']
    localTarget = fileUploadDirectoryPath + '/' + uploadedFile.filename
    uploadedFile.save(os.path.join(fileUploadDirectoryPath, uploadedFile.filename))
    uploadData = {
        "filename": uploadedFile.filename,
        "fullpath": localTarget,
        "filetype": request.form('filetype')
    }
    return jsonify(pdb.createFileUpload(uploadData))

@app.route('/api/htmlcontents/list')
def get_htmlcontents():
    return jsonify(pdb.getHtmlContents())

@app.route('/api/htmlcontents/get/<title>')
def get_htmlcontent(title):
    return jsonify(pdb.getHtmlContent(title))

@app.route('/api/htmlcontents/create', methods=['POST'])
def create_htmlcontent():
    return jsonify(pdb.createHtmlContent(request.form('title'), request.form('content')))

@app.route('/api/htmlcontents/update', methods=['POST'])
def update_htmlcontent():
    return jsonify(pdb.updateHtmlContent(request.form('title'), request.form('content')))

@app.route('/api/keywords/list')
def list_keywords():
    return jsonify(pdb.getKeywords())

@app.route('/api/keywords/create', methods=['POST'])
def create_keyword():
    return jsonify(pdb.createKeyword(request.form('keywordData')))

@app.route('/api/keywords/remove', methods=['POST'])
def remove_keyword():
    return jsonify(pdb.removeKeyword(request.form('keyword')))


# bad request
@app.errorhandler(400)
def not_found(error):
    resp = make_response(render_template('error.html', code=400), 400)
    #resp.headers['X-Something'] = 'A value'
    return resp


# unauthorized
@app.errorhandler(401)
def not_found(error):
    resp = make_response(render_template('error.html', code=401), 401)
    #resp.headers['X-Something'] = 'A value'
    return resp


# forbidden
@app.errorhandler(403)
def not_found(error):
    resp = make_response(render_template('error.html', code=403), 403)
    #resp.headers['X-Something'] = 'A value'
    return resp


# not found
@app.errorhandler(404)
def not_found(error):
    resp = make_response(render_template('error.html', code=404), 404)
    #resp.headers['X-Something'] = 'A value'
    return resp


# method not allowed
@app.errorhandler(405)
def not_found(error):
    resp = make_response(render_template('error.html', code=405), 405)
    #resp.headers['X-Something'] = 'A value'
    return resp